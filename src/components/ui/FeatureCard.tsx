interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  colorScheme: 'blue' | 'purple' | 'green';
}

const colorMap = {
  blue: { bg: 'bg-blue-100', icon: 'text-blue-600' },
  purple: { bg: 'bg-purple-100', icon: 'text-purple-600' },
  green: { bg: 'bg-green-100', icon: 'text-green-600' },
};

export default function FeatureCard({ title, description, icon, colorScheme }: FeatureCardProps) {
  const colors = colorMap[colorScheme];
  
  return (
    <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
      <div className={`${colors.bg} rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
        <i className={`fas ${icon} ${colors.icon} text-xl`}></i>
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
