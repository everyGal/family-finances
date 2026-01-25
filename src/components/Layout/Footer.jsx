const Footer = ({ onAddExpense, onUpdateIncome, onExportPDF }) => {
  const actions = [
    {
      id: 'add-expense',
      label: 'הוספת הוצאה',
      icon: 'add_circle',
      onClick: onAddExpense,
      hoverColor: 'hover:text-primary',
    },
    {
      id: 'update-income',
      label: 'עדכון הכנסה',
      icon: 'payments',
      onClick: onUpdateIncome,
      hoverColor: 'hover:text-emerald-400',
    },
    {
      id: 'export-pdf',
      label: 'ייצוא PDF',
      icon: 'ios_share',
      onClick: onExportPDF,
      hoverColor: 'hover:text-blue-400',
    },
  ];

  return (
    <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <nav
        className="bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/10"
        aria-label="פעולות מהירות"
      >
        {actions.map((action, index) => (
          <div key={action.id} className="contents">
            {index > 0 && (
              <div className="w-px h-4 bg-white/20" aria-hidden="true" />
            )}
            <button
              onClick={action.onClick}
              className={`flex items-center gap-2 ${action.hoverColor} transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg p-1`}
              aria-label={action.label}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                {action.icon}
              </span>
              <span className="text-xs font-bold hidden sm:inline">
                {action.label}
              </span>
            </button>
          </div>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
