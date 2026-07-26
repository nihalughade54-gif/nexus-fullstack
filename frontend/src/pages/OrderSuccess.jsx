import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="container order-success">
        <p>No recent order found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to shop</button>
      </div>
    );
  }

  return (
    <div className="container order-success">
      <CheckCircle2 size={56} color="#3ddc97" strokeWidth={1.5} />
      <h2>Order confirmed</h2>
      <p>Thanks for shopping with NEXUS. Your order <strong>{state.orderId}</strong> is being prepared.</p>
      <p className="order-total">Total charged: ${state.total.toFixed(2)}</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Continue shopping</button>
    </div>
  );
}
