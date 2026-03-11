import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/threatguard-docs/',
  title: 'ThreatGuard',
  description: 'ブランドなりすまし検知・削除申請プラットフォーム',
  lang: 'ja',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'ThreatGuard',
    nav: [
      { text: 'ガイド', link: '/getting-started/overview' },
      { text: '機能', link: '/features/domain-scan' },
      { text: '料金プラン', link: '/pricing' },
      { text: 'ロードマップ', link: '/roadmap/current-mvp' },
      { text: 'セキュリティ', link: '/security/architecture' },
    ],
    sidebar: [
      {
        text: 'はじめに',
        items: [
          { text: 'ThreatGuardとは', link: '/getting-started/overview' },
          { text: 'クイックスタート', link: '/getting-started/quickstart' },
          { text: '用語集', link: '/getting-started/glossary' },
        ],
      },
      {
        text: '機能詳細',
        items: [
          { text: 'ドメインスキャン', link: '/features/domain-scan' },
          { text: 'ページ調査', link: '/features/page-investigation' },
          { text: '画像類似度判定', link: '/features/image-similarity' },
          { text: 'リスクスコアリング', link: '/features/risk-scoring' },
          { text: '削除申請フロー', link: '/features/takedown-request' },
          { text: 'ダッシュボード', link: '/features/dashboard' },
          { text: 'レポート・エクスポート', link: '/features/reports' },
        ],
      },
      {
        text: '料金プラン',
        items: [
          { text: 'プラン・機能一覧', link: '/plans' },
          { text: '料金プラン', link: '/pricing' },
        ],
      },
      {
        text: 'ロードマップ',
        items: [
          { text: 'MVP機能一覧', link: '/roadmap/current-mvp' },
          { text: '今後の開発予定', link: '/roadmap/upcoming' },
        ],
      },
      {
        text: 'セキュリティ',
        items: [
          { text: 'システム構成', link: '/security/architecture' },
          { text: 'データの取り扱い', link: '/security/data-handling' },
          { text: '準拠規格・法令', link: '/security/compliance' },
        ],
      },
      {
        text: '法務',
        items: [
          { text: '利用規約', link: '/legal/terms' },
        ],
      },
      {
        text: 'その他',
        items: [
          { text: 'よくある質問', link: '/faq' },
        ],
      },
    ],
    outline: {
      label: '目次',
      level: [2, 3],
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '検索', buttonAriaLabel: '検索' },
          modal: {
            noResultsText: '結果が見つかりません',
            resetButtonTitle: 'リセット',
            footer: { selectText: '選択', navigateText: '移動', closeText: '閉じる' },
          },
        },
      },
    },
    footer: {
      message: 'ThreatGuard — ブランドなりすまし検知・削除申請プラットフォーム',
    },
    docFooter: {
      prev: '前のページ',
      next: '次のページ',
    },
  },
})
