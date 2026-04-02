// data.js - Mock Data

const ships = {
  S001: { name: 'MV Titan', cap: '52,000 MT' },
  S002: { name: 'MV Neptune', cap: '38,000 MT' },
  S003: { name: 'MV Horizon', cap: '65,000 MT' },
  S004: { name: 'MV Orion', cap: '28,500 MT' },
  S005: { name: 'MV Atlas', cap: '71,000 MT' },
};

const customers = {
  C001: { email: 'r.mehta@reliance.com', phone: '+91 98765 43210', addr: 'Maker Chambers IV, Mumbai' },
  C002: { email: 'anita.s@tatasteel.com', phone: '+91 87654 32109', addr: 'Bombay House, Mumbai' },
  C003: { email: 'v.nair@ongc.in', phone: '+91 76543 21098', addr: 'Scope Complex, New Delhi' },
  C004: { email: 'p.desai@adani.com', phone: '+91 65432 10987', addr: 'Adani House, Ahmedabad' },
  C005: { email: 's.kumar@lt.com', phone: '+91 54321 09876', addr: 'L&T House, Mount Road, Chennai' },
};

const shipmentsData = [
  { id: 'SHP-2024-1284', cust: 'Reliance Industries', ship: 'MV Titan', route: 'Mumbai → Dubai', cargo: 'General Cargo', wt: '2,500', status: 'delivered', eta: 'Jan 19' },
  { id: 'SHP-2024-1283', cust: 'Adani Ports', ship: 'MV Neptune', route: 'Chennai → Singapore', cargo: 'Container', wt: '1,800', status: 'transit', eta: 'Jan 31' },
  { id: 'SHP-2024-1282', cust: 'Tata Steel', ship: 'MV Atlas', route: 'Kandla → Rotterdam', cargo: 'Bulk Cargo', wt: '68,000', status: 'transit', eta: 'Feb 08' },
  { id: 'SHP-2024-1281', cust: 'ONGC', ship: 'MV Horizon', route: 'Mumbai → Colombo', cargo: 'Liquid Cargo', wt: '12,000', status: 'arrival', eta: 'Jan 28' },
  { id: 'SHP-2024-1280', cust: 'L&T Shipping', ship: 'MV Orion', route: 'JNPT → Shanghai', cargo: 'General Cargo', wt: '3,200', status: 'delayed', eta: 'Feb 02 ⚠' },
  { id: 'SHP-2024-1279', cust: 'Reliance Industries', ship: 'MV Titan', route: 'Dubai → Mumbai', cargo: 'Refrigerated', wt: '950', status: 'pending', eta: 'Feb 05' },
  { id: 'SHP-2024-1278', cust: 'Adani Ports', ship: 'MV Neptune', route: 'Chennai → Dubai', cargo: 'Container', wt: '2,100', status: 'delivered', eta: 'Jan 24' },
  { id: 'SHP-2024-1277', cust: 'Tata Steel', ship: 'MV Atlas', route: 'Vizag → Singapore', cargo: 'Bulk Cargo', wt: '55,000', status: 'transit', eta: 'Feb 12' },
];

const statusBadge = (s) => ({
  delivered: '<span class="badge badge-success">● Delivered</span>',
  transit: '<span class="badge badge-info">⟶ In Transit</span>',
  arrival: '<span class="badge badge-warning">⚓ Port Arrival</span>',
  delayed: '<span class="badge badge-danger">⚠ Delayed</span>',
  pending: '<span class="badge badge-neutral">○ Pending</span>',
}[s] || s);