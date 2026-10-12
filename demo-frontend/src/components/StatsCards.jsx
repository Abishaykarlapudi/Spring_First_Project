import { Users, Mail, Phone, Activity } from 'lucide-react';

export default function StatsCards({ records = [], backendStatus = 'online' }) {
  const totalRecords = records.length;
  const emailsCount = records.filter(r => r.email && r.email.includes('@')).length;
  const phonesCount = records.filter(r => r.number && String(r.number).trim().length >= 7).length;

  const stats = [
    {
      title: 'Total Contacts',
      value: totalRecords,
      subtitle: `${totalRecords} registered in database`,
      icon: Users,
      color: 'indigo',
    },
    {
      title: 'Valid Emails',
      value: emailsCount,
      subtitle: `${Math.round((emailsCount / (totalRecords || 1)) * 100)}% email coverage`,
      icon: Mail,
      color: 'pink',
    },
    {
      title: 'Phone Numbers',
      value: phonesCount,
      subtitle: `${Math.round((phonesCount / (totalRecords || 1)) * 100)}% reachable via SMS/call`,
      icon: Phone,
      color: 'cyan',
    },
    {
      title: 'API Status',
      value: backendStatus === 'online' ? 'Active' : 'Standby',
      subtitle: 'Spring Boot REST on :5000',
      icon: Activity,
      color: backendStatus === 'online' ? 'emerald' : 'amber',
    },
  ];

  return (
    <section className="stats-grid" aria-label="System Statistics">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div key={idx} className={`stat-card stat-${stat.color}`}>
            <div className="stat-content">
              <span className="stat-title">{stat.title}</span>
              <div className="stat-value">{stat.value}</div>
              <span className="stat-subtitle">{stat.subtitle}</span>
            </div>
            <div className={`stat-icon-wrapper bg-${stat.color}`}>
              <IconComponent size={22} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
