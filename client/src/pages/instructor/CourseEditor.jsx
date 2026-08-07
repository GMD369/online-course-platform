import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ImagePlus, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { assetUrl } from '../../utils/assetUrl';

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Design',
  'Business',
  'Marketing',
  'Photography',
  'Music',
  'Other',
];

export default function CourseEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    price: 0,
  });
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: '', content: '', videoUrl: '', duration: '' });

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/courses/${id}`).then(({ data }) => {
      const c = data.data.course;
      setCourse(c);
      setForm({ title: c.title, description: c.description, category: c.category, level: c.level, price: c.price });
      setLoading(false);
    });
  }, [id, isEdit]);

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.price < 0) errs.price = 'Price cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEdit) {
        await api.patch(`/courses/${id}`, form);
        toast.success('Course updated');
      } else {
        const { data } = await api.post('/courses', form);
        toast.success('Course created — now add some lessons!');
        navigate(`/dashboard/courses/${data.data.course._id}/edit`, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  }

  async function handleThumbnailUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('thumbnail', file);
    try {
      const { data } = await api.post(`/courses/${id}/thumbnail`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCourse((c) => ({ ...c, thumbnail: data.data.thumbnail }));
      toast.success('Thumbnail updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleAddLesson(e) {
    e.preventDefault();
    if (!newLesson.title.trim()) return;
    try {
      const { data } = await api.post(`/courses/${id}/lessons`, {
        ...newLesson,
        duration: Number(newLesson.duration) || 0,
      });
      setCourse(data.data.course);
      setNewLesson({ title: '', content: '', videoUrl: '', duration: '' });
      toast.success('Lesson added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lesson');
    }
  }

  async function handleDeleteLesson(lessonId) {
    try {
      const { data } = await api.delete(`/courses/${id}/lessons/${lessonId}`);
      setCourse(data.data.course);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lesson');
    }
  }

  if (loading) return <Spinner className="h-10 w-10" />;

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit course' : 'Create a new course'}</h1>

      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Course title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={errors.title}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select label="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </Select>
            <Input
              label="Price (USD)"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              error={errors.price}
            />
          </div>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" /> {isEdit ? 'Save changes' : 'Create course'}
          </Button>
        </form>
      </Card>

      {isEdit && (
        <>
          <Card className="p-6">
            <h2 className="mb-3 font-semibold text-slate-900">Thumbnail</h2>
            <div className="flex items-center gap-4">
              <div className="h-24 w-40 overflow-hidden rounded-lg bg-slate-100">
                {course?.thumbnail ? (
                  <img src={assetUrl(course.thumbnail)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  {uploading ? 'Uploading...' : 'Upload image'}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={uploading} />
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 font-semibold text-slate-900">Lessons</h2>
            <ul className="mb-4 divide-y divide-slate-100">
              {course?.lessons?.map((lesson, i) => (
                <li key={lesson._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {i + 1}. {lesson.title}
                    </p>
                    <p className="text-xs text-slate-400">{lesson.duration}m</p>
                  </div>
                  <button onClick={() => handleDeleteLesson(lesson._id)} className="rounded-md p-1.5 text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
              {!course?.lessons?.length && <p className="py-4 text-sm text-slate-400">No lessons yet.</p>}
            </ul>

            <form onSubmit={handleAddLesson} className="space-y-3 border-t border-slate-100 pt-4">
              <Input
                label="Lesson title"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                placeholder="e.g. Introduction to Hooks"
              />
              <Input
                label="Content notes (optional)"
                value={newLesson.content}
                onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Video URL (optional)"
                  value={newLesson.videoUrl}
                  onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                />
                <Input
                  label="Duration (minutes)"
                  type="number"
                  min="0"
                  value={newLesson.duration}
                  onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                />
              </div>
              <Button type="submit" variant="secondary">
                <Plus className="h-4 w-4" /> Add lesson
              </Button>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
