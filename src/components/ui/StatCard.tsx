interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  colorScheme: 'blue' | 'teal' | 'green' | 'orange' | 'red';
}

const colorMap = {
  blue: {
    bg: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-600',
    value: 'text-blue-900',
    icon: 'bg-blue-500',
  },
  teal: {
    bg: 'from-teal-50 to-teal-100',
    border: 'border-teal-200',
    text: 'text-teal-600',
    value: 'text-teal-900',
    icon: 'bg-teal-500',
  },
  green: {
    bg: 'from-green-50 to-green-100',
    border: 'border-green-200',
    text: 'text-green-600',
    value: 'text-green-900',
    icon: 'bg-green-500',
  },
  orange: {
    bg: 'from-orange-50 to-orange-100',
    border: 'border-orange-200',
    text: 'text-orange-600',
    value: 'text-orange-900',
    icon: 'bg-orange-500',
  },
  red: {
    bg: 'from-red-50 to-red-100',
    border: 'border-red-200',
    text: 'text-red-600',
    value: 'text-red-900',
    icon: 'bg-red-500',
  },
};

export default function StatCard({ title, value, icon, colorScheme }: StatCardProps) {
  const colors = colorMap[colorScheme];
  
  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-xl p-6 border ${colors.border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${colors.text} uppercase`}>{title}</p>
          <p className={`text-4xl font-bold ${colors.value} mt-2`}>{value}</p>
        </div>
        <div className={`${colors.icon} rounded-full p-4 shadow-lg`}>
          <i className={`fas ${icon} text-2xl text-white`}></i>
        </div>
      </div>
    </div>
  );
}
