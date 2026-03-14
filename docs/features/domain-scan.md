# ドメインスキャン

> **ひとことで：** ブランド名を登録するだけで、なりすましに使われそうなドメインを自動で見つけ出します。

ドメインスキャンは、ThreatGuard の最初のステップです。2つの手法を組み合わせて、不審なドメインを網羅的に検出します。

## 検知手法

### 手法A：類似ドメイン生成 + DNS検証

正規ドメイン（例: `example-brand.com`）をもとに、攻撃者が登録しそうな類似ドメインを自動生成し、実在するかを検証します。

#### 1. ホモグリフ置換

見た目が似た文字に差し替えたドメインを生成します。

| 元の文字 | 置換例 | 生成されるドメイン例 |
|---------|--------|------------------|
| `l` | `1`（イチ）, `I`（アイ）, `ĺ` | `examp1e-brand.com` |
| `e` | `è`, `é`, `ε`（ギリシャ文字）, `е`（キリル文字） | `èxample-brand.com` |
| `a` | `à`, `á`, `ɑ`, `а`（キリル文字） | `exаmple-brand.com` |

26文字のアルファベットすべてに対して、キリル文字・ギリシャ文字・アクセント付き文字などのマッピングを持っています。

#### 2. タイポスクワッティング

ユーザーのタイプミスを狙ったドメインを生成します。4つのパターンをカバー：

| パターン | 説明 | 例 |
|---------|------|-----|
| **隣接キー誤打** | QWERTYキーボードの隣のキー | `example-brend.com`（a→e） |
| **文字の脱落** | 1文字抜け | `exmple-brand.com`（a脱落） |
| **文字の重複** | 1文字ダブり | `exaample-brand.com`（a重複） |
| **隣接スワップ** | 隣り合う2文字の入れ替え | `exmaple-brand.com`（a↔m） |

#### 3. TLD差し替え

トップレベルドメインを変えたバリエーションを生成します。

```
example-brand.com → example-brand.net / example-brand.org / example-brand.io
                  example-brand.xyz / example-brand.app / example-brand.info
                  example-brand.biz / example-brand.dev / example-brand.tech
                  example-brand.online / example-brand.site / example-brand.shop
```

14種のTLDをチェックします。

#### 4. ハイフン挿入/除去

```
example-brand.com → example-brand-x.com / ex-amplebrand.com / exampl-ebrand.com
example-brand-x.com → example-brand.com（ハイフン除去）
```

#### DNS検証

生成された全候補に対して、DNS解決（`dns.resolve`）を実行します。

- **IPアドレスが返る** → 実在するドメイン → データベースに保存
- **IPアドレスが返らない** → 未登録のドメイン → スキップ
- ホワイトリストに登録されたドメイン → 除外

::: info 技術詳細（CISO向け）
- DNSレートリミット回避のため、バッチ処理で順次実行
- Aレコード照会によるDNS解決
- ホワイトリストはブランドごとに管理
:::

### 手法B：Certificate Transparency（CT）監視

SSL証明書の発行ログを監視して、ブランド名を含むドメインの証明書取得を検出します。

#### 仕組み

1. 公開CTログAPI に対して、ブランド名・ドメイン・キーワードで検索
2. 世界中の認証局が発行したSSL証明書のログから、一致するドメインを抽出
3. 自社ドメイン・ホワイトリストを除外して、新規検出分をデータベースに保存

#### なぜ有効か

攻撃者がフィッシングサイトを作る際、多くの場合SSL証明書を取得します（`https://` にしないとブラウザが警告を出すため）。CT監視により、**サイトが公開される前の準備段階で検知**できる可能性があります。

::: info 技術詳細（CISO向け）
- 公開CTログAPIでワイルドカード検索
- 証明書の`name_value`からドメインを抽出
- ワイルドカード証明書のプレフィックスは除去
- ブランド名・ドメイン名・全キーワードを検索タームとして使用
:::

## 検出後の流れ

ドメインスキャンで検出されたドメインは、以下のステータスで管理されます。

```
new_domain（新規検出）
    ↓ AI分析
analyzing（分析中）
    ↓
confirmed_threat（脅威確認）  or  false_positive（誤検知）
    ↓
takedown_sent（削除申請済み）
    ↓
resolved（解決済み）
```

::: info ステータス「脅威確認」
`confirmed_threat` は、AI分析やページ調査によって脅威と判定されたドメインに付与されるステータスです。このステータスのドメインが削除申請の対象となります。
:::

## 次のステップ

- [ページ調査](/features/page-investigation) — 検出されたドメインの実態を調べる
- [リスクスコアリング](/features/risk-scoring) — 脅威の優先度を判定する
