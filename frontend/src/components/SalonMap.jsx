function place(table) {
  const left = ((Number(table.x) + 4.2) / 8.4) * 100
  const top = ((Number(table.z) + 3.2) / 7.2) * 100
  return { left: `${left}%`, top: `${top}%` }
}

export default function SalonMap({ tables, selectedId, onSelect }) {
  return (
    <div className="salon">
      {tables.map((table) => {
        const chosen = table.id === selectedId
        const state = chosen ? 'chosen' : table.available ? 'free' : (table.reason || 'taken')
        return (
          <button
            key={table.id}
            type="button"
            className={`salon-table ${table.shape || 'round'} ${state}`}
            style={place(table)}
            disabled={!table.available}
            aria-pressed={chosen}
            onClick={() => onSelect(table.id)}
          >
            <strong>{table.label}</strong>
            <span>{table.seatsLabel}</span>
          </button>
        )
      })}
    </div>
  )
}
