import Link from 'next/link';

interface QuickActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: string;
  actionText: string;
  colorScheme: 'purple' | 'blue' | 'green';
}

const colorMap = {
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    text: 'text-purple-600',
  },
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    text: 'text-blue-600',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    text: 'text-green-600',
  },
};

export default function QuickActionCard({ 
  href, 
  title, 
  description, 
  icon, 
  actionText, 
  colorScheme 
}: QuickActionCardProps) {
  const colors = colorMap[colorScheme];
  
  return (
    <Link
      href={href}
      className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${colors.gradient} p-6`}>
        <i className={`fas ${icon} text-4xl text-white mb-2`}></i>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{description}</p>
        <div className={`flex items-center ${colors.text} font-semibold group-hover:translate-x-2 transition-transform`}>
          {actionText}
          <i className="fas fa-arrow-right ml-2"></i>
        </div>
      </div>
    </Link>
  );
}
