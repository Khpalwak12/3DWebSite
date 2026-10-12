import { Link } from 'react-router-dom'
import { useRestaurant } from '../context'

export default function Footer() {
  const { info } = useRestaurant()

  return (
    <footer className="footer">
      <div>
        <p className="brand-mark">دسترخوان</p>
        <p>{info?.tagline || 'د کابل خوند، پر یوه دسترخوان'}</p>
      </div>
      <div>
        <h2>پته</h2>
        <p>{info ? `${info.address}، ${info.city}` : 'کابل'}</p>
        <p><a href={`tel:${info?.phone || ''}`}>{info?.phone}</a></p>
      </div>
      <div>
        <h2>ساعتونه</h2>
        {(info?.hours || []).map((row) => (
          <p key={row.days}>{row.days}: {row.time}</p>
        ))}
      </div>
      <div>
        <h2>پاڼې</h2>
        <p><Link to="/menu">مینو</Link></p>
        <p><Link to="/reserve">ځای نیول</Link></p>
        <p><Link to="/about">زموږ کیسه</Link></p>
      </div>
    </footer>
  )
}
