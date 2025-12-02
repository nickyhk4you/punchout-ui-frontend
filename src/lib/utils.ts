export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-800',
    RECEIVED: 'bg-blue-100 text-blue-800',
    CREATE: 'bg-green-100 text-green-800',
    EDIT: 'bg-yellow-100 text-yellow-800',
    PRODUCTION: 'bg-red-100 text-red-800',
    STAGING: 'bg-orange-100 text-orange-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};
