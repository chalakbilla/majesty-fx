import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTA from '../components/CTA.jsx';
import FAQ from '../components/FAQ.jsx';
import { Accent, FeatureGrid, PageHero, Section, SectionHead, SpecTable, TradeLink } from '../components/route/blocks.jsx';

const cellRenderers = {
  pair: (p) => (
    <div className="rp-pair">
      <strong>{p.name}</strong>
      <small>{p.desc}</small>
    </div>
  ),
  chip: (v) => <span className="rp-chip">{v}</span>,
  bold: (v) => <strong>{v}</strong>,
  good: (v) => <strong className="good">{v}</strong>,
};

export default function AssetPage({ crumb, heroIcon, badge, heroTitle, heroSub, pills, title, body, actions, secondaryTo, image, caption, leverage, why, features, spec, faq }) {
  const columns = [
    ...spec.columns.map(([key, label, kind]) => ({ key, label, render: cellRenderers[kind] })),
    { key: 'action', label: 'ACTION', align: 'right', render: () => <TradeLink /> },
  ];
  const CaptionIcon = caption?.[0];

  return (
    <>
      <PageHero crumbs={['Markets', crumb]} icon={heroIcon} badge={badge} title={heroTitle} sub={heroSub} />

      <Section>
        <div className="rp-split grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-center">
          <div className="rp-split-copy">
            <div className="rp-pills flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
              {pills.map(([Icon, label]) => (
                <span key={label} className="rp-badge shrink-0 whitespace-nowrap"><Icon /> {label}</span>
              ))}
            </div>
            <h2 className="rp-h2"><Accent text={title} /></h2>
            <p className="rp-lead">{body}</p>
            <div className="btn-row flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link to="/register" className="btn btn-primary btn-lg flex items-center justify-center gap-2 w-full sm:w-auto text-center">{actions[0]} <ArrowRight /></Link>
              <Link to={secondaryTo ?? '/register'} className="btn btn-outline btn-lg flex items-center justify-center w-full sm:w-auto text-center">{actions[1]}</Link>
            </div>
          </div>
          <figure className="rp-figure w-full max-w-[500px] mx-auto">
            <img src={image} alt={crumb} />
            {caption && (
              <figcaption>
                <span><CaptionIcon /> {caption[1]}</span>
                <em>{leverage}</em>
              </figcaption>
            )}
          </figure>
        </div>
      </Section>

      <Section tone="soft">
        <SectionHead icon={why.icon} tag={why.tag} title={why.title} sub={why.sub} />
        <FeatureGrid items={features} />
      </Section>

      <Section tone="soft" className="is-flush">
        <SectionHead title={spec.title} sub={spec.sub} />
        <SpecTable columns={columns} rows={spec.rows} tint="slate" />
      </Section>

      {faq && <FAQ />}
      <CTA />
    </>
  );
}
