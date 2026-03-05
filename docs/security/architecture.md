# システム構成

> **ひとことで：** ThreatGuard はフロントエンド・API・データベースを分離したクラウドアーキテクチャで、安全かつスケーラブルに運用されています。

## 全体構成図

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐
│   ブラウザ    │────▶│  Vercel CDN  │────▶│   Next.js (SSR/SSG)  │
│  (ユーザー)   │     │              │     │   フロントエンド      │
└──────────────┘     └──────────────┘     └──────────────────────┘
                                                    │
                                                    ▼ API呼び出し
                                          ┌──────────────────────┐
                                          │   Express.js API     │
                                          │   (Railway)          │
                                          │                      │
                                          │  ├ 認証 (JWT)        │
                                          │  ├ スキャンエンジン    │
                                          │  ├ Playwright        │
                                          │  ├ AI分析 (Claude)   │
                                          │  └ メール送信 (SMTP) │
                                          └──────────────────────┘
                                             │          │
                                    ┌────────┘          └────────┐
                                    ▼                            ▼
                          ┌──────────────┐            ┌──────────────┐
                          │  PostgreSQL  │            │    Redis     │
                          │  (Railway)   │            │  (Railway)   │
                          │              │            │              │
                          │  脅威データ   │            │  セッション   │
                          │  ユーザー    │            │  キャッシュ   │
                          │  テナント    │            │              │
                          └──────────────┘            └──────────────┘
```

## コンポーネント詳細

### フロントエンド

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js (App Router) |
| ホスティング | Vercel |
| ドメイン | `threatguard.jp` |
| 認証 | JWT トークンベース |
| UI | Tailwind CSS |

### APIサーバー

| 項目 | 内容 |
|------|------|
| フレームワーク | Express.js (TypeScript) |
| ホスティング | Railway |
| ドメイン | `api.threatguard.jp` |
| ORM | Prisma |
| ブラウザエンジン | Playwright (Chromium, ヘッドレス) |

### データベース

| 項目 | 内容 |
|------|------|
| DBMS | PostgreSQL |
| ホスティング | Railway |
| ORM | Prisma（マイグレーション管理） |

### 外部サービス連携

| サービス | 用途 |
|---------|------|
| Anthropic API (Claude) | AI脅威分類・テイクダウン文面生成 |
| crt.sh | Certificate Transparency ログ検索 |
| rdap.org | ドメイン登録情報照会 |
| Gmail SMTP | テイクダウンメール送信・通知メール |
| Slack Webhook | アラート通知 |

## マルチテナント設計

ThreatGuard はマルチテナントアーキテクチャを採用しています。

```
Organization（組織）
  └── Brand（ブランド）- 複数登録可
        └── DetectedDomain（検出ドメイン）
              ├── WebProbe（調査結果）- 履歴保持
              ├── ThreatAnalysis（AI分析）- 履歴保持
              └── TakedownRequest（削除申請）
```

- 各組織のデータは完全に分離
- API層で `organizationId` によるフィルタリングを実施
- superadmin は全組織のデータにアクセス可能

## 認証・認可

| ロール | 権限 |
|--------|------|
| **superadmin** | 全組織・全データへのアクセス。組織管理 |
| **admin** | 自組織内の全操作。ブランド管理・ユーザー管理 |
| **member** | 自組織内の閲覧・基本操作 |

- JWT トークンで認証
- 各APIエンドポイントでロールチェック

## 次のステップ

- [データの取り扱い](/security/data-handling) — 収集データの保存と管理
- [準拠規格・法令](/security/compliance) — セキュリティポリシーと法令対応
