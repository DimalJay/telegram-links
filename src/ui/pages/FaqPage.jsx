import React from 'react';

const faqs = [
  {
    id: 'what-is-telegram',
    question: 'What is Telegram and how does it work?',
    answer:
      'Telegram is a free, cloud-based instant messaging app available on iOS, Android, Windows, macOS, and the web. It lets you send messages, photos, videos, and files of any type, make voice and video calls, and join public communities. Unlike WhatsApp, Telegram stores your messages on its own servers (encrypted) so you can access them from any device at any time.',
  },
  {
    id: 'telegram-group-vs-channel',
    question: 'What is the difference between a Telegram group and a channel?',
    answer:
      'A Telegram group is a two-way chat where all members can send messages, making it ideal for communities and discussions (up to 200,000 members). A Telegram channel is a one-way broadcast platform where only admins post content — subscribers can only read and react. Channels are perfect for news feeds, announcements, and content publishing with unlimited subscribers.',
  },
  {
    id: 'how-to-join-telegram-group',
    question: 'How do I join a Telegram group or channel?',
    answer:
      'You can join a Telegram group or channel in three ways: (1) Click an invite link that starts with t.me/ or telegram.me/ — it will open directly in the Telegram app. (2) Search for the group/channel username in the Telegram search bar. (3) Ask an existing member to add you. On this site, every listing has a "Join" button that takes you straight to the group or channel.',
  },
  {
    id: 'telegram-safe-to-use',
    question: 'Is Telegram safe to use?',
    answer:
      'Telegram is generally considered safe. It uses MTProto encryption for all messages in transit, and offers an optional "Secret Chat" mode with end-to-end encryption and self-destructing messages. Regular chats are encrypted server-side. For maximum privacy, use Secret Chats. Be cautious about joining unknown groups — spam, scams, and misinformation can exist in any open community.',
  },
  {
    id: 'telegram-group-member-limit',
    question: 'What is the maximum number of members in a Telegram group?',
    answer:
      'A standard Telegram group supports up to 200,000 members. If you need more, you can convert it to a "Supergroup" which also supports 200,000 members but adds advanced admin tools, a member list, and pinned messages. Telegram Channels have no member limit at all — they can have millions of subscribers.',
  },
  {
    id: 'find-best-telegram-groups',
    question: 'How do I find the best Telegram groups and channels?',
    answer:
      'The best ways to discover Telegram groups and channels are: (1) Browse curated directories like this site — we list trending, latest, and hot groups/channels by category. (2) Search Google with "best Telegram groups for [topic]". (3) Ask in Reddit communities related to your interest. (4) Look for invite links shared on Twitter, Discord, or YouTube. Our directory is updated daily with verified, active links.',
  },
  {
    id: 'telegram-vs-whatsapp',
    question: 'Which is better: Telegram or WhatsApp?',
    answer:
      'Both apps have strengths. Telegram offers larger groups (200k vs 1,024), bots, channels, no file size limit with Premium, multi-device support without a phone, and more customization. WhatsApp has end-to-end encryption on all chats by default and is more widely used for personal messaging. Telegram is generally preferred for large communities, content distribution, and developers due to its open API.',
  },
  {
    id: 'telegram-bots-what-are-they',
    question: 'What are Telegram bots and what can they do?',
    answer:
      'Telegram bots are automated accounts built using the Telegram Bot API. They can perform a huge range of tasks: sending news updates, moderating groups, answering FAQs, scheduling posts, accepting payments, playing games, fetching weather/exchange rates, and more. You can add a bot to your group or chat with it directly. There are over 300 million monthly active bots on Telegram.',
  },
  {
    id: 'telegram-premium-worth-it',
    question: 'Is Telegram Premium worth it?',
    answer:
      'Telegram Premium ($4.99/mo) adds: 4 GB file transfers (vs 2 GB free), unlimited cloud storage, faster downloads, exclusive stickers and reactions, profile badges, no ads in channels, and more. It is worth it if you share large files regularly, want an ad-free experience, or use Telegram as a primary workflow tool. For casual users, the free tier is more than sufficient.',
  },
  {
    id: 'how-to-leave-telegram-group',
    question: 'How do I leave a Telegram group or channel?',
    answer:
      'To leave a Telegram group: Open the group → tap the group name at the top → scroll down and tap "Leave Group". To leave a channel: Open the channel → tap the channel name → tap "Leave Channel". You will no longer receive notifications from it. On mobile, you can also long-press the group/channel in your chat list and select "Leave".',
  },
  {
    id: 'telegram-link-types',
    question: 'What types of Telegram links are there?',
    answer:
      'There are several Telegram link formats: (1) t.me/username — public group or channel with a username. (2) t.me/joinchat/HASH — private invite link for a group. (3) t.me/+HASH — modern private invite link format. (4) t.me/username/POST_ID — a link to a specific channel post. (5) t.me/username?start=PARAM — a deep link to start a bot with a parameter. All can be opened in a browser or directly in the Telegram app.',
  },
  {
    id: 'telegram-anonymous-admin',
    question: 'Can I be an anonymous admin in a Telegram group?',
    answer:
      'Yes. In Telegram Supergroups, admins can choose to post as the group itself rather than their personal account. Go to the group → Admin permissions → enable "Remain anonymous". When this is on, your name won\'t appear on your messages — they\'ll show the group name instead. This is useful for maintaining a brand or community persona while managing a large group.',
  },
];

function FaqItem({ faq, isOpen, onToggle }) {
  const panelId = `faq-panel-${faq.id}`;
  const buttonId = `faq-btn-${faq.id}`;

  return (
    <div
      className="faq-item"
      style={{
        border: '1px solid var(--tg-border)',
        borderRadius: '0.875rem',
        background: 'var(--tg-surface)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        boxShadow: isOpen ? '0 4px 24px rgba(34,158,217,0.10)' : undefined,
      }}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1.125rem 1.25rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--tg-text)',
        }}
      >
        <span
          style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          {faq.question}
        </span>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            width: '1.75rem',
            height: '1.75rem',
            borderRadius: '50%',
            background: isOpen ? 'var(--tg-primary)' : 'var(--tg-card-hover)',
            color: isOpen ? '#fff' : 'var(--tg-primary)',
            fontSize: '1.1rem',
            fontWeight: 700,
            transition: 'background 0.2s, color 0.2s, transform 0.25s',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        style={{
          padding: isOpen ? '0 1.25rem 1.25rem' : '0 1.25rem',
          color: 'var(--tg-muted)',
          fontSize: '0.9rem',
          lineHeight: 1.7,
        }}
      >
        {faq.answer}
      </div>
    </div>
  );
}

export function FaqPage() {
  const [openId, setOpenId] = React.useState(faqs[0].id);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  /* JSON-LD FAQ schema for Google rich results */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section
        style={{
          maxWidth: '780px',
          margin: '0 auto',
          padding: '2.5rem 0 4rem',
        }}
      >
        {/* Page header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 1rem',
              borderRadius: '999px',
              background: 'rgba(34,158,217,0.12)',
              color: 'var(--tg-primary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              marginBottom: '1rem',
              textTransform: 'uppercase',
            }}
          >
            📋 FAQ
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              color: 'var(--tg-text)',
              marginBottom: '0.75rem',
            }}
          >
            Frequently Asked Questions
          </h1>
          <p
            style={{
              color: 'var(--tg-muted)',
              fontSize: '1rem',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            Everything you need to know about Telegram — groups, channels, bots,
            safety, and more. Answers to the most-Googled Telegram questions.
          </p>
        </div>

        {/* Accordion list */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          {faqs.map((faq) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => toggle(faq.id)}
            />
          ))}
        </div>

        {/* CTA footer */}
        <div
          style={{
            marginTop: '2.5rem',
            padding: '1.5rem',
            borderRadius: '1rem',
            background: 'rgba(34,158,217,0.08)',
            border: '1px solid rgba(34,158,217,0.18)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: 'var(--tg-text)',
              fontWeight: 600,
              marginBottom: '0.4rem',
            }}
          >
            Can't find what you're looking for?
          </p>
          <p style={{ color: 'var(--tg-muted)', fontSize: '0.9rem' }}>
            Browse our curated directory of the best Telegram{' '}
            <a href="/groups">groups</a> and <a href="/channels">channels</a>,
            or <a href="/">explore trending links</a> right now.
          </p>
        </div>
      </section>
    </>
  );
}
