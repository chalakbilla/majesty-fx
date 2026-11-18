import { ArrowUp } from 'lucide-react';
import logo from '../assets/logo.png';
import { footerColumns } from '../data.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="risk-bar">
          <span className="risk-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 3 20h18L12 3z" /><path d="M12 10v4M12 17.5v.5" />
            </svg>
          </span>
          <p>
            <strong>Risk Warning:</strong> CFDs are complex instruments and come with a high risk of losing money rapidly
            due to leverage. Consider whether you understand how CFDs work and whether you can afford the high risk of
            losing your money. Trading Contracts for Difference on margin carries a high level of risk and may not be
            suitable for all investors.
          </p>
        </div>

        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand">
              <img src={logo} alt="" className="brand-logo" />
              <span className="brand-text">Majesty <span className="accent">FX</span></span>
            </div>
            <p>
              Institutional multi-asset trading infrastructure. Trade Forex, Metals, Indices, and Crypto CFDs
              with raw spreads, sub-20ms ultra-low latency, and Tier-1 segregated custody.
            </p>
            <p className="footer-contact">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
              support@majestyfx.com
            </p>
            <p className="footer-contact">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg>
              24/5 Global Trading Support Desk
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4>{col.title.toUpperCase()}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-legal">
          <div>
            <h5>CORPORATE ENTITY &amp; LICENSING INFORMATION</h5>
            <p>
              <strong>Majesty FX</strong> (<strong>majestyfx.com</strong>) is operated by <strong>MajestyFX Ltd</strong> (Company Registration No. <strong>202500773</strong>), registered under the International Business Companies (IBC) Act in Saint Lucia. Registered Office: Rodney Bayside Building, Rodney Bay, Gros Islet, Saint Lucia. Associated operations and clearing services are provided in affiliation with <strong>Majesty Financial Services Ltd</strong> (Registration No. <strong>26824 BC 2022</strong>. Registered Office: Suite 305, Griffith Corporate Centre, Beachmont, Kingstown, St. Vincent and the Grenadines) with European representative presence at B1 359, 28 October Avenue, Trust Re Building, Limassol 3107, Cyprus.
            </p>
          </div>
          <div>
            <h5>CLIENT FUND SAFETY &amp; REGULATORY COMPLIANCE</h5>
            <p>
              All client funds are held in fully segregated custodial accounts at Tier-1 international banking institutions and are completely isolated from company operating capital. Majesty FX operates in strict alignment with international Anti-Money Laundering (AML) and Counter-Terrorist Financing (CTF) standards following FATF recommendations. All transactional data and MetaTrader 5 communication bridges are protected by enterprise 256-bit SSL encryption.
            </p>
          </div>
          <div>
            <h5>HIGH-RISK INVESTMENT WARNING</h5>
            <p>
              Trading Contracts for Difference (CFDs) and Foreign Exchange (Forex) on margin carries a high degree of risk and can result in the loss of your entire deposited capital. Leverage magnifies both potential gains and losses. CFDs are complex financial instruments and may not be suitable for all investors. You should not speculate with funds you cannot afford to lose. Prior to opening an account with Majesty FX, carefully review your investment objectives, level of experience, and risk tolerance. Past performance is no guarantee of future returns.
            </p>
          </div>
          <div>
            <h5>REGIONAL RESTRICTIONS</h5>
            <p>
              Majesty FX does not offer services to citizens or residents of certain jurisdictions, including but not limited to the United States of America, Canada, Cuba, Iran, North Korea, Sudan, Syria, or any jurisdiction where such distribution or trading would violate local laws or regulations.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 <strong>Majesty FX</strong> — All rights reserved. Sovereign Institutional Trading Infrastructure.</span>
          <span className="security">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z" /></svg>
            Security: 256-Bit SSL Encrypted <span className="dot-sep">·</span> Tier-1 Segregated Custody
          </span>
          <a href="#top" className="btn btn-dark btn-sm">Back to Top <ArrowUp /></a>
        </div>
      </div>
    </footer>
  );
}
