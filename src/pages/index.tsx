import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.grid} />
      <div className={styles.glow} />
      <div className="container">
        <div className={styles.inner}>
          <div>
            <span className={clsx(styles.eyebrow, styles.reveal, styles.d1)}>
              <span className={styles.dot} /> Turma 2TDSPG · E-commerce API v1
            </span>
            <Heading as="h1" className={clsx(styles.title, styles.reveal, styles.d2)}>
              Integre a <span className={styles.accent}>loja da turma</span> em minutos.
            </Heading>
            <p className={clsx(styles.subtitle, styles.reveal, styles.d3)}>
              Guias, arquitetura e a referência completa da API que o app do seu grupo consome —
              autenticação, catálogo, carrinho, pedidos e webhooks.
            </p>
            <div className={clsx(styles.actions, styles.reveal, styles.d4)}>
              <Link className={styles.btnPrimary} to="/docs/comece-aqui/primeiros-passos">
                Primeiros passos →
              </Link>
              <Link className={styles.btnGhost} to="/docs/api/e-commerce-api-projeto-da-turma">
                Referência da API
              </Link>
            </div>
          </div>

          <div className={clsx(styles.terminal, styles.reveal, styles.d3)}>
            <div className={styles.termBar}>
              <span className={styles.termDot1} />
              <span className={styles.termDot2} />
              <span className={styles.termDot3} />
              <span className={styles.termTitle}>primeira-chamada.sh</span>
            </div>
            <pre className={styles.termBody}>
{`$ `}<span className={styles.prompt}>curl</span>{` https://api.turma/v1/products \\
   `}<span className={styles.flag}>-H</span>{` `}<span className={styles.str}>"X-API-Key: sk_live_••••"</span>{` \\
   `}<span className={styles.flag}>-H</span>{` `}<span className={styles.str}>"X-Student-RM: RM550001"</span>{`

`}<span className={styles.muted}>{`# 200 OK`}</span>{`
{ `}<span className={styles.key}>"data"</span>{`: [ { `}<span className={styles.key}>"name"</span>{`: `}<span className={styles.str}>"Fone Bluetooth"</span>{`,
           `}<span className={styles.key}>"priceFrom"</span>{`: 199.9 } ],
  `}<span className={styles.key}>"total"</span>{`: 9 }`}
            </pre>
          </div>
        </div>
      </div>
    </header>
  );
}

type CardItem = { title: string; emoji: string; to: string; desc: string };

const CARDS: CardItem[] = [
  { title: 'Comece aqui', emoji: '🚀', to: '/docs/comece-aqui/o-que-e', desc: 'Entenda o projeto e faça a primeira chamada em 5 minutos.' },
  { title: 'Guias', emoji: '📗', to: '/docs/guias/autenticacao', desc: 'Autenticação, fluxo de compra, produtos, webhooks e deploy.' },
  { title: 'Arquitetura', emoji: '🧩', to: '/docs/arquitetura/visao-geral', desc: 'Diagramas Mermaid/PlantUML, modelo de dados e cálculos.' },
  { title: 'Estudos de caso', emoji: '💼', to: '/docs/estudos-de-caso/loja-de-games', desc: 'Decisões reais de grupos montando loja e app mobile.' },
  { title: 'Referência da API', emoji: '🔌', to: '/docs/api/e-commerce-api-projeto-da-turma', desc: 'Referência OpenAPI completa, testável, gerada do backend.' },
  { title: 'Swagger (API viva)', emoji: '🧪', to: 'http://localhost:3333/docs', desc: 'Teste cada endpoint na hora, com autenticação.' },
];

function HubCards() {
  return (
    <section className={styles.cards}>
      <div className="container">
        <Heading as="h2" className={styles.cardsTitle}>Por onde começar</Heading>
        <div className="row">
          {CARDS.map((c) => (
            <div key={c.title} className="col col--4 margin-bottom--lg">
              <Link to={c.to} className={styles.card}>
                <div className={styles.cardEmoji}>{c.emoji}</div>
                <div className={styles.cardTitle}>{c.title}</div>
                <p className={styles.cardDesc}>{c.desc}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Hub de Docs" description={siteConfig.tagline}>
      <Hero />
      <main>
        <HubCards />
      </main>
    </Layout>
  );
}
