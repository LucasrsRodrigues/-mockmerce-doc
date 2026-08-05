/**
 * Swizzle do DocCard (wrap) — cards da referência OpenAPI mais ricos:
 *  - emoji por método HTTP (no lugar do 📄 genérico);
 *  - badge colorido do método (GET/POST/PUT/PATCH/DELETE);
 *  - descrição só quando é genuína (não repete o título);
 *  - emoji temático por categoria (tag) no índice /docs/api.
 *
 * Cards que não são de API caem no comportamento padrão do Docusaurus.
 */
import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {
  useDocById,
  findFirstSidebarItemLink,
} from '@docusaurus/plugin-content-docs/client';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {
  extractLeadingEmoji,
  useDocCardDescriptionCategoryItemsPlural,
} from '@docusaurus/theme-common/internal';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Layout from '@theme/DocCard/Layout';
import {API_TAG_EMOJI} from '@site/src/apiTagEmoji';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

const METHOD_EMOJI: Record<HttpMethod, string> = {
  get: '🔎',
  post: '➕',
  put: '♻️',
  patch: '✏️',
  delete: '🗑️',
};

const HTTP_METHODS: HttpMethod[] = ['get', 'post', 'put', 'patch', 'delete'];

/** Extrai o método HTTP a partir do className gerado ("api-method get"). */
function getHttpMethod(className?: string): HttpMethod | null {
  if (!className) {
    return null;
  }
  const tokens = className.toLowerCase().split(/\s+/);
  return HTTP_METHODS.find((m) => tokens.includes(m)) ?? null;
}

function getFallbackEmojiIcon(item: any): string {
  if (item.type === 'category') {
    return '🗃';
  }
  return isInternalUrl(item.href) ? '📄️' : '🔗';
}

function getIconTitleProps(item: any) {
  const extracted = extractLeadingEmoji(item.label);
  const emoji = extracted.emoji ?? getFallbackEmojiIcon(item);
  return {icon: emoji, title: extracted.rest.trim()};
}

/** Card de um endpoint da API: emoji do método + título + badge do método. */
function ApiMethodCard({
  item,
  method,
  doc,
}: {
  item: any;
  method: HttpMethod;
  doc: any;
}): ReactNode {
  const {emoji, title} = (() => {
    const extracted = extractLeadingEmoji(item.label);
    return extracted.emoji
      ? {emoji: extracted.emoji, title: extracted.rest.trim()}
      : {emoji: METHOD_EMOJI[method], title: (item.label ?? '').trim()};
  })();

  // Só mostra a descrição quando ela agrega algo além de repetir o título.
  const rawDescription = (item.description ?? doc?.description ?? '').trim();
  const description =
    rawDescription && rawDescription.toLowerCase() !== title.toLowerCase()
      ? rawDescription
      : null;

  return (
    <Link
      href={item.href}
      className={clsx(
        'card padding--lg',
        ThemeClassNames.docs.docCard.container,
        item.className,
        'apiCard',
      )}>
      <div className="apiCard__head">
        <span className="apiCard__emoji" aria-hidden="true">
          {emoji}
        </span>
        <span className="apiCard__title" title={title}>
          {title}
        </span>
        <span className={clsx('apiCard__method', `apiCard__method--${method}`)}>
          {method.toUpperCase()}
        </span>
      </div>
      {description && <p className="apiCard__desc">{description}</p>}
    </Link>
  );
}

function CardCategory({item}: {item: any}): ReactNode {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useDocCardDescriptionCategoryItemsPlural();
  if (!href) {
    return null;
  }
  const extracted = extractLeadingEmoji(item.label);
  const icon =
    extracted.emoji ?? API_TAG_EMOJI[item.label] ?? getFallbackEmojiIcon(item);
  return (
    <Layout
      item={item}
      className={item.className}
      href={href}
      icon={icon}
      title={extracted.rest.trim() || item.label}
      description={item.description ?? categoryItemsPlural(item.items.length)}
    />
  );
}

function CardLink({item}: {item: any}): ReactNode {
  const doc = useDocById(item.docId ?? undefined);
  const method = getHttpMethod(item.className);
  if (method) {
    return <ApiMethodCard item={item} method={method} doc={doc} />;
  }
  // Doc comum: comportamento padrão.
  return (
    <Layout
      item={item}
      className={item.className}
      href={item.href}
      description={item.description ?? doc?.description}
      {...getIconTitleProps(item)}
    />
  );
}

export default function DocCard({item}: {item: any}): ReactNode {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
