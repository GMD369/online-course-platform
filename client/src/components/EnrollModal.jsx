import { useState } from 'react';
import { X, Lock, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import Button from './ui/Button';
import Input from './ui/Input';
import { formatCurrency } from '../utils/format';

export default function EnrollModal({ course, onClose, onEnrolled }) {
  const isFree = !course.price;
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function formatCardNumber(value) {
    return value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  async function handleConfirm(e) {
    e.preventDefault();
    setError('');

    if (!isFree) {
      const digits = card.number.replace(/\s/g, '');
      if (digits.length < 12) {
        setError('Enter a valid card number (this is a mock checkout — any 12+ digit number works).');
        return;
      }
      if (!card.expiry || !card.cvc) {
        setError('Please fill in the expiry date and CVC.');
        return;
      }
    }

    setLoading(true);
    try {
      await api.post(`/enrollments/${course._id}`, {
        cardNumber: isFree ? undefined : card.number.replace(/\s/g, ''),
      });
      toast.success('Enrolled successfully!');
      onEnrolled();
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{isFree ? 'Confirm enrollment' : 'Checkout'}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-slate-50 p-3">
          <p className="font-medium text-slate-800">{course.title}</p>
          <p className="mt-1 text-sm text-slate-500">Total: <span className="font-bold text-brand-700">{formatCurrency(course.price)}</span></p>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          {!isFree && (
            <>
              <Input
                label="Card number"
                placeholder="4242 4242 4242 4242"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                inputMode="numeric"
              />
              <div className="flex gap-3">
                <Input
                  label="Expiry"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                />
                <Input
                  label="CVC"
                  placeholder="123"
                  value={card.cvc}
                  onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  inputMode="numeric"
                />
              </div>
              <p className="flex items-center gap-1.5 text-xs text-slate-400">
                <Lock className="h-3.5 w-3.5" /> This is a simulated checkout — no real payment is processed.
              </p>
            </>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            <CreditCard className="h-4 w-4" />
            {isFree ? 'Enroll for free' : `Pay ${formatCurrency(course.price)}`}
          </Button>
        </form>
      </div>
    </div>
  );
}
