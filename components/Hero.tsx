import Waves from "./Waves";

function LaptopUI() {
  return (
    <div className="ui" aria-hidden="true">
      <div className="side">
        <b>LeadCapp</b>
        <span className="on">Dashboard</span><span>Orders</span><span>Customers</span><span>Reports</span><span>Settings</span>
      </div>
      <div className="main">
        <h4>Good morning 👋</h4>
        <div className="chips"><span>This week</span><span>Month</span><span>Year</span></div>
        <div className="row">
          <div className="k"><small>Revenue</small><strong>₹4.2L</strong><em>+18%</em></div>
          <div className="k"><small>Orders</small><strong>1,284</strong><em>+9%</em></div>
          <div className="k"><small>Users</small><strong>8,930</strong><em>+24%</em></div>
          <div className="k"><small>Uptime</small><strong>99.9%</strong><em>stable</em></div>
        </div>
        <div className="chart">
          <small style={{ color: "#7d7f86", textTransform: "uppercase", letterSpacing: ".06em", fontSize: ".8em" }}>Growth</small>
          <svg viewBox="0 0 300 80" preserveAspectRatio="none">
            <path d="M0 70 C40 66 60 50 90 52 S150 30 180 34 S240 14 300 8" stroke="#ECEEF8" strokeWidth="2" fill="none" />
            <path d="M0 70 C40 66 60 50 90 52 S150 30 180 34 S240 14 300 8 V80 H0Z" fill="rgba(236,238,248,.07)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PhoneUI() {
  return (
    <div className="app" role="img" aria-label="Example mobile app screen built by LeadCapp">
      <div className="sb"><span>9:41</span><i /><span>●●● ▮</span></div>
      <div className="hd"><div><small>Welcome back</small><b>Hi, Rahim</b></div><span className="av">R</span></div>
      <div className="bal">
        <small>Today&apos;s sales</small><strong>₹48,250</strong><em>▲ 12.4% vs yesterday</em>
        <svg viewBox="0 0 200 40" preserveAspectRatio="none">
          <path d="M0 34 C20 30 34 32 50 24 S80 26 98 18 S130 20 150 10 S182 8 200 4" stroke="#ECEEF8" strokeWidth="1.6" fill="none" />
          <path d="M0 34 C20 30 34 32 50 24 S80 26 98 18 S130 20 150 10 S182 8 200 4 V40 H0Z" fill="rgba(236,238,248,.08)" />
        </svg>
      </div>
      <div className="qa"><span>New</span><span>Orders</span><span>Stock</span><span>Reports</span></div>
      <h6>Recent orders <span>See all</span></h6>
      <div className="li"><i>🛒</i><div><b>Order #2841</b><small>3 items · 2 min ago</small></div><em>₹1,240</em></div>
      <div className="li"><i>📦</i><div><b>Order #2840</b><small>Out for delivery</small></div><em className="ok">On the way</em></div>
      <div className="li"><i>💳</i><div><b>Order #2839</b><small>UPI · paid</small></div><em>₹860</em></div>
      <div className="tb"><span className="on">Home</span><span>Orders</span><span>Insights</span><span>Profile</span></div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      <Waves />
      <div className="veil" aria-hidden="true" />
      <div className="wrap">
        <span className="badge"><i />Partnering with startups &amp; enterprises <svg className="flag" viewBox="0 0 18 12" aria-label="India" role="img"><rect width="18" height="4" fill="#FF9933" /><rect y="4" width="18" height="4" fill="#fff" /><rect y="8" width="18" height="4" fill="#138808" /><circle cx="9" cy="6" r="1.5" fill="none" stroke="#000080" strokeWidth=".5" /></svg></span>
        <h1>
          <span className="ln"><span>Your idea deserves</span></span>
          <span className="ln"><span>a great app.</span></span>
          <span className="ln"><span>We build it.</span></span>
        </h1>
        <p className="sub">
          LeadCapp Software Solutions designs, builds and launches mobile apps, web platforms and cloud systems, so you can focus on growing
          your business, not managing developers.
        </p>
        <div className="ctas">
          <button className="pill pill-line" type="button" data-book="hero">Book a Free Strategy Call</button>
          <a className="pill pill-text" href="#flow" data-track="see_how_we_build_click">See How We Build ↓</a>
        </div>

        <div className="devices" aria-label="Examples of apps and dashboards we build">
          <div className="laptop">
            <div className="lid"><LaptopUI /></div>
            <div className="base" />
          </div>
          <div className="tablet" aria-hidden="true">
            <div className="tab-ui">
              <h5>Your business.<br /><b>Reimagined.</b></h5>
              <p>Simple digital solutions. Real business impact.</p>
              <span>Let&apos;s build your idea →</span>
            </div>
          </div>
          <div className="phone"><div className="scr"><PhoneUI /></div></div>
        </div>
      </div>
    </section>
  );
}
