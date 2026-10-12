/**
 * アイカツ！アンコール カードデータ
 *
 * IMPORTANT:
 * CARDS の並び順は共有URLのカードindexとして使用します。
 *
 * 基本ルール：
 *   E1 → E2 → E3 → ... → promo
 *
 * 一度公開した後は、既存カードの
 *   - 並び順変更
 *   - 削除
 *   - 途中への新規カード挿入
 * をしないでください。
 *
 * 新しいシリーズは、既存のEシリーズの後ろ、
 * promoの前に追加します。
 *
 * id       : カード識別子
 * rarity   : N / R / PR / ER
 * series   : "1" = 1弾, "2" = 2弾, ... "promo" = プロモーション
 * image    : images/cards/ フォルダに置く画像パス
 * parallel : true = パラレルカード
 *
 * パラレルカードについて：
 *
 *   通常カード
 *     E1-01_PR
 *
 *   パラレルカード
 *     E1-01_PR_p1
 *
 * パラレルカードは共有URLの既存indexを壊さないため、
 * 通常カードの直後には配列上では挿入しない。
 *
 * 表示時にJavaScript側で
 *
 *   E1-01_PR
 *   E1-01_PR_p1
 *   E1-02_PR
 *   E1-02_PR_p1
 *
 * のように並べる。
 */

const CARDS = [
  // ========================================
  // E1（通常カード 全85枚）
  // ========================================

  { id: "E1-01_PR", name: "E1-01 PR", rarity: "PR", series: "1", image: "images/cards/E1-01_PR.webp", type: "トップス", dressName: "オーロラキネスキャミソール" },
  { id: "E1-02_PR", name: "E1-02 PR", rarity: "PR", series: "1", image: "images/cards/E1-02_PR.webp", type: "ボトムス", dressName: "オーロラキネスドレープスカート" },
  { id: "E1-03_PR", name: "E1-03 PR", rarity: "PR", series: "1", image: "images/cards/E1-03_PR.webp", type: "シューズ", dressName: "オーロラキネスバレエシューズ" },
  { id: "E1-04_PR", name: "E1-04 PR", rarity: "PR", series: "1", image: "images/cards/E1-04_PR.webp", type: "アクセサリー", dressName: "オーロラキネスリボン" },

  { id: "E1-05_R", name: "E1-05 R", rarity: "R", series: "1", image: "images/cards/E1-05_R.webp", type: "トップス", dressName: "アイスブルーフリルキャミソール" },
  { id: "E1-06_R", name: "E1-06 R", rarity: "R", series: "1", image: "images/cards/E1-06_R.webp", type: "ボトムス", dressName: "アイスブルーフリルパニエ" },
  { id: "E1-07_R", name: "E1-07 R", rarity: "R", series: "1", image: "images/cards/E1-07_R.webp", type: "シューズ", dressName: "アイスブルーシューズ" },
  { id: "E1-08_R", name: "E1-08 R", rarity: "R", series: "1", image: "images/cards/E1-08_R.webp", type: "アクセサリー", dressName: "ジュエルつきパープルリボン" },
  { id: "E1-09_R", name: "E1-09 R", rarity: "R", series: "1", image: "images/cards/E1-09_R.webp", type: "トップス&ボトムス", dressName: "小花柄イエローワンピ" },
  { id: "E1-10_R", name: "E1-10 R", rarity: "R", series: "1", image: "images/cards/E1-10_R.webp", type: "トップス", dressName: "ドリーミースタートップス" },
  { id: "E1-11_R", name: "E1-11 R", rarity: "R", series: "1", image: "images/cards/E1-11_R.webp", type: "ボトムス", dressName: "ドリーミースタースカート" },
  { id: "E1-12_R", name: "E1-12 R", rarity: "R", series: "1", image: "images/cards/E1-12_R.webp", type: "シューズ", dressName: "ドリーミースターパンプス" },
  { id: "E1-13_R", name: "E1-13 R", rarity: "R", series: "1", image: "images/cards/E1-13_R.webp", type: "トップス", dressName: "チャーミーリボントップス" },
  { id: "E1-14_R", name: "E1-14 R", rarity: "R", series: "1", image: "images/cards/E1-14_R.webp", type: "ボトムス", dressName: "チャーミーリボンスカート" },
  { id: "E1-15_R", name: "E1-15 R", rarity: "R", series: "1", image: "images/cards/E1-15_R.webp", type: "シューズ", dressName: "チャーミーリボンサンダル" },
  { id: "E1-16_R", name: "E1-16 R", rarity: "R", series: "1", image: "images/cards/E1-16_R.webp", type: "アクセサリー", dressName: "チャーミーリボンアクセ" },
  { id: "E1-17_R", name: "E1-17 R", rarity: "R", series: "1", image: "images/cards/E1-17_R.webp", type: "トップス", dressName: "クリアネスイエロートップス" },
  { id: "E1-18_R", name: "E1-18 R", rarity: "R", series: "1", image: "images/cards/E1-18_R.webp", type: "ボトムス", dressName: "クリアネスイエロースカート" },
  { id: "E1-19_R", name: "E1-19 R", rarity: "R", series: "1", image: "images/cards/E1-19_R.webp", type: "シューズ", dressName: "クリアネスイエローパンプス" },
  { id: "E1-20_R", name: "E1-20 R", rarity: "R", series: "1", image: "images/cards/E1-20_R.webp", type: "アクセサリー", dressName: "クリアネスイエローアクセ" },

  { id: "E1-21_N", name: "E1-21 N", rarity: "N", series: "1", image: "images/cards/E1-21_N.webp", type: "トップス", dressName: "ピンクステージベスト" },
  { id: "E1-22_N", name: "E1-22 N", rarity: "N", series: "1", image: "images/cards/E1-22_N.webp", type: "ボトムス", dressName: "ピンクステージスカート" },
  { id: "E1-23_N", name: "E1-23 N", rarity: "N", series: "1", image: "images/cards/E1-23_N.webp", type: "シューズ", dressName: "ピンクステージシューズ" },
  { id: "E1-24_N", name: "E1-24 N", rarity: "N", series: "1", image: "images/cards/E1-24_N.webp", type: "トップス", dressName: "パフスリーブレモンカラーボレロ" },
  { id: "E1-25_N", name: "E1-25 N", rarity: "N", series: "1", image: "images/cards/E1-25_N.webp", type: "ボトムス", dressName: "ラベンダーフリルスカート" },
  { id: "E1-26_N", name: "E1-26 N", rarity: "N", series: "1", image: "images/cards/E1-26_N.webp", type: "シューズ", dressName: "イエロー編み上げブーツ" },
  { id: "E1-27_N", name: "E1-27 N", rarity: "N", series: "1", image: "images/cards/E1-27_N.webp", type: "トップス", dressName: "ピンクブロッサムトップス" },
  { id: "E1-28_N", name: "E1-28 N", rarity: "N", series: "1", image: "images/cards/E1-28_N.webp", type: "ボトムス", dressName: "ピンクブロッサムスカート" },
  { id: "E1-29_N", name: "E1-29 N", rarity: "N", series: "1", image: "images/cards/E1-29_N.webp", type: "シューズ", dressName: "ピンクブロッサムブーツ" },

  { id: "E1-30_ER", name: "E1-30 ER", rarity: "ER", series: "1", image: "images/cards/E1-30_ER.webp", type: "フルコーデ", dressName: "オデットスワン" },
  { id: "E1-31_ER", name: "E1-31 ER", rarity: "ER", series: "1", image: "images/cards/E1-31_ER.webp", type: "フルコーデ", dressName: "リルリボンストーリー" },
  { id: "E1-32_ER", name: "E1-32 ER", rarity: "ER", series: "1", image: "images/cards/E1-32_ER.webp", type: "フルコーデ", dressName: "オーロラペガサス" },

  { id: "E1-33_PR", name: "E1-33 PR", rarity: "PR", series: "1", image: "images/cards/E1-33_PR.webp", type: "トップス", dressName: "天の川コズミックツインショルダー" },
  { id: "E1-34_PR", name: "E1-34 PR", rarity: "PR", series: "1", image: "images/cards/E1-34_PR.webp", type: "ボトムス", dressName: "天の川コズミックスカート" },
  { id: "E1-35_PR", name: "E1-35 PR", rarity: "PR", series: "1", image: "images/cards/E1-35_PR.webp", type: "シューズ", dressName: "天の川コズミックブーツ" },
  { id: "E1-36_PR", name: "E1-36 PR", rarity: "PR", series: "1", image: "images/cards/E1-36_PR.webp", type: "アクセサリー", dressName: "天の川コズミックチューナー" },

  { id: "E1-37_R", name: "E1-37 R", rarity: "R", series: "1", image: "images/cards/E1-37_R.webp", type: "トップス&ボトムス", dressName: "プリズムネイビーグラフィックワンピ" },
  { id: "E1-38_R", name: "E1-38 R", rarity: "R", series: "1", image: "images/cards/E1-38_R.webp", type: "トップス", dressName: "ブラックモダンボレロ" },
  { id: "E1-39_R", name: "E1-39 R", rarity: "R", series: "1", image: "images/cards/E1-39_R.webp", type: "ボトムス", dressName: "ブラックフューチャーモダンベルショートパンツ" },
  { id: "E1-40_R", name: "E1-40 R", rarity: "R", series: "1", image: "images/cards/E1-40_R.webp", type: "シューズ", dressName: "ブラックフューチャーブーツ" },

  { id: "E1-41_N", name: "E1-41 N", rarity: "N", series: "1", image: "images/cards/E1-41_N.webp", type: "トップス", dressName: "ブルーステージブラウス" },
  { id: "E1-42_N", name: "E1-42 N", rarity: "N", series: "1", image: "images/cards/E1-42_N.webp", type: "ボトムス", dressName: "ブルーステージスカート" },
  { id: "E1-43_N", name: "E1-43 N", rarity: "N", series: "1", image: "images/cards/E1-43_N.webp", type: "シューズ", dressName: "ブルーステージブーツ" },
  { id: "E1-44_N", name: "E1-44 N", rarity: "N", series: "1", image: "images/cards/E1-44_N.webp", type: "トップス", dressName: "ブラックストライプジャケット" },
  { id: "E1-45_N", name: "E1-45 N", rarity: "N", series: "1", image: "images/cards/E1-45_N.webp", type: "ボトムス", dressName: "ダイヤモンドチェックスカート" },
  { id: "E1-46_N", name: "E1-46 N", rarity: "N", series: "1", image: "images/cards/E1-46_N.webp", type: "シューズ", dressName: "ブルーストラップシューズ" },
  { id: "E1-47_N", name: "E1-47 N", rarity: "N", series: "1", image: "images/cards/E1-47_N.webp", type: "トップス", dressName: "ネイビーブロッサムトップス" },
  { id: "E1-48_N", name: "E1-48 N", rarity: "N", series: "1", image: "images/cards/E1-48_N.webp", type: "ボトムス", dressName: "ネイビーブロッサムスカート" },
  { id: "E1-49_N", name: "E1-49 N", rarity: "N", series: "1", image: "images/cards/E1-49_N.webp", type: "シューズ", dressName: "ネイビーブロッサムブーツ" },

  { id: "E1-50_ER", name: "E1-50 ER", rarity: "ER", series: "1", image: "images/cards/E1-50_ER.webp", type: "フルコーデ", dressName: "ドリームエミネンス" },

  { id: "E1-51_PR", name: "E1-51 PR", rarity: "PR", series: "1", image: "images/cards/E1-51_PR.webp", type: "トップス&ボトムス", dressName: "レジェンドリールージュドレス" },
  { id: "E1-52_PR", name: "E1-52 PR", rarity: "PR", series: "1", image: "images/cards/E1-52_PR.webp", type: "シューズ", dressName: "レジェンドリールージュパンプス" },

  { id: "E1-53_R", name: "E1-53 R", rarity: "R", series: "1", image: "images/cards/E1-53_R.webp", type: "トップス&ボトムス", dressName: "アゲハレッドコクーンワンピ" },
  { id: "E1-54_R", name: "E1-54 R", rarity: "R", series: "1", image: "images/cards/E1-54_R.webp", type: "シューズ", dressName: "アゲハレッドミュール" },
  { id: "E1-55_R", name: "E1-55 R", rarity: "R", series: "1", image: "images/cards/E1-55_R.webp", type: "トップス&ボトムス", dressName: "パープルジュエリーワンピ" },
  { id: "E1-56_R", name: "E1-56 R", rarity: "R", series: "1", image: "images/cards/E1-56_R.webp", type: "シューズ", dressName: "ゴールドチェーングラディエーター" },
  { id: "E1-57_R", name: "E1-57 R", rarity: "R", series: "1", image: "images/cards/E1-57_R.webp", type: "トップス", dressName: "アゲハロゴフリルトップス" },
  { id: "E1-58_R", name: "E1-58 R", rarity: "R", series: "1", image: "images/cards/E1-58_R.webp", type: "ボトムス", dressName: "アゲハファースカート" },
  { id: "E1-59_R", name: "E1-59 R", rarity: "R", series: "1", image: "images/cards/E1-59_R.webp", type: "アクセサリー", dressName: "ブラックシフォンカチューシャ" },

  { id: "E1-60_N", name: "E1-60 N", rarity: "N", series: "1", image: "images/cards/E1-60_N.webp", type: "トップス", dressName: "パープルステージトップス" },
  { id: "E1-61_N", name: "E1-61 N", rarity: "N", series: "1", image: "images/cards/E1-61_N.webp", type: "ボトムス", dressName: "パープルステージスカート" },
  { id: "E1-62_N", name: "E1-62 N", rarity: "N", series: "1", image: "images/cards/E1-62_N.webp", type: "シューズ", dressName: "パープルステージニーハイパンプス" },
  { id: "E1-63_N", name: "E1-63 N", rarity: "N", series: "1", image: "images/cards/E1-63_N.webp", type: "トップス", dressName: "プッチがらシャイニングトップス" },
  { id: "E1-64_N", name: "E1-64 N", rarity: "N", series: "1", image: "images/cards/E1-64_N.webp", type: "ボトムス", dressName: "ブラックウォッシュデニムミニ" },
  { id: "E1-65_N", name: "E1-65 N", rarity: "N", series: "1", image: "images/cards/E1-65_N.webp", type: "トップス", dressName: "セクシーロゴチューブトップ" },
  { id: "E1-66_N", name: "E1-66 N", rarity: "N", series: "1", image: "images/cards/E1-66_N.webp", type: "ボトムス", dressName: "ベルトつきレザースカート" },
  { id: "E1-67_N", name: "E1-67 N", rarity: "N", series: "1", image: "images/cards/E1-67_N.webp", type: "シューズ", dressName: "サイハイレザーブーツ" },
  { id: "E1-68_N", name: "E1-68 N", rarity: "N", series: "1", image: "images/cards/E1-68_N.webp", type: "トップス", dressName: "パープルブロッサムトップス" },
  { id: "E1-69_N", name: "E1-69 N", rarity: "N", series: "1", image: "images/cards/E1-69_N.webp", type: "ボトムス", dressName: "パープルブロッサムスカート" },
  { id: "E1-70_N", name: "E1-70 N", rarity: "N", series: "1", image: "images/cards/E1-70_N.webp", type: "シューズ", dressName: "パープルブロッサムブーツ" },

  { id: "E1-71_PR", name: "E1-71 PR", rarity: "PR", series: "1", image: "images/cards/E1-71_PR.webp", type: "トップス", dressName: "サンシャインスターウェイトップス" },
  { id: "E1-72_PR", name: "E1-72 PR", rarity: "PR", series: "1", image: "images/cards/E1-72_PR.webp", type: "ボトムス", dressName: "サンシャインスターウェイスカート" },
  { id: "E1-73_PR", name: "E1-73 PR", rarity: "PR", series: "1", image: "images/cards/E1-73_PR.webp", type: "シューズ", dressName: "サンシャインスターウェイシューズ" },
  { id: "E1-74_PR", name: "E1-74 PR", rarity: "PR", series: "1", image: "images/cards/E1-74_PR.webp", type: "アクセサリー", dressName: "サンシャインスターウェイカチューシャ" },
  { id: "E1-75_PR", name: "E1-75 PR", rarity: "PR", series: "1", image: "images/cards/E1-75_PR.webp", type: "トップス", dressName: "サンライズスターウェイトップス" },
  { id: "E1-76_PR", name: "E1-76 PR", rarity: "PR", series: "1", image: "images/cards/E1-76_PR.webp", type: "ボトムス", dressName: "サンライズスターウェイスカート" },
  { id: "E1-77_PR", name: "E1-77 PR", rarity: "PR", series: "1", image: "images/cards/E1-77_PR.webp", type: "シューズ", dressName: "サンライズスターウェイシューズ" },
  { id: "E1-78_PR", name: "E1-78 PR", rarity: "PR", series: "1", image: "images/cards/E1-78_PR.webp", type: "アクセサリー", dressName: "サンライズスターウェイカチューシャ" },
  { id: "E1-79_PR", name: "E1-79 PR", rarity: "PR", series: "1", image: "images/cards/E1-79_PR.webp", type: "トップス", dressName: "サンセットスターウェイトップス" },
  { id: "E1-80_PR", name: "E1-80 PR", rarity: "PR", series: "1", image: "images/cards/E1-80_PR.webp", type: "ボトムス", dressName: "サンセットスターウェイスカート" },
  { id: "E1-81_PR", name: "E1-81 PR", rarity: "PR", series: "1", image: "images/cards/E1-81_PR.webp", type: "シューズ", dressName: "サンセットスターウェイシューズ" },
  { id: "E1-82_PR", name: "E1-82 PR", rarity: "PR", series: "1", image: "images/cards/E1-82_PR.webp", type: "アクセサリー", dressName: "サンセットスターウェイカチューシャ" },

  { id: "E1-83_N", name: "E1-83 N", rarity: "N", series: "1", image: "images/cards/E1-83_N.webp", type: "トップス", dressName: "イエローブロッサムトップス" },
  { id: "E1-84_N", name: "E1-84 N", rarity: "N", series: "1", image: "images/cards/E1-84_N.webp", type: "ボトムス", dressName: "イエローブロッサムスカート" },
  { id: "E1-85_N", name: "E1-85 N", rarity: "N", series: "1", image: "images/cards/E1-85_N.webp", type: "シューズ", dressName: "イエローブロッサムブーツ" },

  // ========================================
  // E2
  // ========================================
  // ここにE2のカードを追加

  // ========================================
  // E3
  // ========================================
  // ここにE3のカードを追加

  // ========================================
  // E4
  // ========================================
  // ここにE4のカードを追加

  // ========================================
  // E5以降
  // ========================================
  // E6, E7 ... も同じ形式でここに追加

  // ========================================
  // プロモーション
  // ========================================

  { id: "EP-001_N", name: "EP-001 N", rarity: "N", series: "promo", image: "images/cards/EP-001_N.webp", type: "トップス&ボトムス", dressName: "ピンクステージベスト&スカート" },
  { id: "EP-002_PR", name: "EP-002 PR", rarity: "PR", series: "promo", image: "images/cards/EP-002_PR.webp", type: "アクセサリー", dressName: "レジェンドリールージュティアラ" },
  { id: "EP-003_N", name: "EP-003 N", rarity: "N", series: "promo", image: "images/cards/EP-003_N.webp", type: "トップス&ボトムス", dressName: "エメラルドコクーンワンピ" },
  { id: "EP-004_N", name: "EP-004 N", rarity: "N", series: "promo", image: "images/cards/EP-004_N.webp", type: "シューズ", dressName: "エメラルドアゲハミュール" },
  { id: "EP-005_N", name: "EP-005 N", rarity: "N", series: "promo", image: "images/cards/EP-005_N.webp", type: "アクセサリー", dressName: "ピンクシフォンカチューシャ" },
  { id: "EP-006_N", name: "EP-006 N", rarity: "N", series: "promo", image: "images/cards/EP-006_N.webp", type: "トップス", dressName: "ピンクリボンつきフリルシャツ" },
  { id: "EP-007_N", name: "EP-007 N", rarity: "N", series: "promo", image: "images/cards/EP-007_N.webp", type: "トップス", dressName: "ピンクアーガイルカーデ" },
  { id: "EP-008_N", name: "EP-008 N", rarity: "N", series: "promo", image: "images/cards/EP-008_N.webp", type: "ボトムス", dressName: "ピンクプリーツスカート" },
  { id: "EP-009_N", name: "EP-009 N", rarity: "N", series: "promo", image: "images/cards/EP-009_N.webp", type: "シューズ", dressName: "ガーリーローファー" },
  { id: "EP-010_N", name: "EP-010 N", rarity: "N", series: "promo", image: "images/cards/EP-010_N.webp", type: "アクセサリー", dressName: "ピンクリボンカチューシャ" },
  { id: "EP-011_N", name: "EP-011 N", rarity: "N", series: "promo", image: "images/cards/EP-011_N.webp", type: "トップス&ボトムス", dressName: "スターライト学園ピンクジャージ" },
  { id: "EP-012_N", name: "EP-012 N", rarity: "N", series: "promo", image: "images/cards/EP-012_N.webp", type: "トップス&ボトムス", dressName: "スターライト学園ブルージャージ" },
  { id: "EP-013_N", name: "EP-013 N", rarity: "N", series: "promo", image: "images/cards/EP-013_N.webp", type: "トップス&ボトムス", dressName: "スターライト学園パープルジャージ" },
  { id: "EP-014_N", name: "EP-014 N", rarity: "N", series: "promo", image: "images/cards/EP-014_N.webp", type: "トップス&ボトムス", dressName: "スターライト学園オレンジジャージ" },
  { id: "EP-015_N", name: "EP-015 N", rarity: "N", series: "promo", image: "images/cards/EP-015_N.webp", type: "シューズ", dressName: "スターライト学園スニーカー" },
  { id: "EP-016_N", name: "EP-016 N", rarity: "N", series: "promo", image: "images/cards/EP-016_N.webp", type: "トップス&ボトムス", dressName: "ブラックダイヤモンドジュエリーワンピ" },
  { id: "EP-017_N", name: "EP-017 N", rarity: "N", series: "promo", image: "images/cards/EP-017_N.webp", type: "トップス&ボトムス", dressName: "ピンクの小花柄ワンピ" },
  { id: "EP-018_N", name: "EP-018 N", rarity: "N", series: "promo", image: "images/cards/EP-018_N.webp", type: "シューズ", dressName: "編み上げラベンダーブーツ" },

  { id: "EP-029_R", name: "EP-029 R", rarity: "R", series: "promo", image: "images/cards/EP-029_R.webp", type: "トップス&ボトムス", dressName: "スターライト学園制服" },
  { id: "EP-030_R", name: "EP-030 R", rarity: "R", series: "promo", image: "images/cards/EP-030_R.webp", type: "シューズ", dressName: "スターライト学園ブーツ" },
  { id: "EP-031_R", name: "EP-031 R", rarity: "R", series: "promo", image: "images/cards/EP-031_R.webp", type: "トップス", dressName: "ガーリーデビルトップス" },
  { id: "EP-032_R", name: "EP-032 R", rarity: "R", series: "promo", image: "images/cards/EP-032_R.webp", type: "ボトムス", dressName: "ガーリーデビルスカート" },
  { id: "EP-033_R", name: "EP-033 R", rarity: "R", series: "promo", image: "images/cards/EP-033_R.webp", type: "シューズ", dressName: "ガーリーデビルパンプス" },
  { id: "EP-034_R", name: "EP-034 R", rarity: "R", series: "promo", image: "images/cards/EP-034_R.webp", type: "トップス", dressName: "モンスターキャットトップス" },
  { id: "EP-035_R", name: "EP-035 R", rarity: "R", series: "promo", image: "images/cards/EP-035_R.webp", type: "ボトムス", dressName: "モンスターキャットスカート" },
  { id: "EP-036_R", name: "EP-036 R", rarity: "R", series: "promo", image: "images/cards/EP-036_R.webp", type: "シューズ", dressName: "モンスターキャットファーブーツ" },
  { id: "EP-037_N", name: "EP-037 N", rarity: "N", series: "promo", image: "images/cards/EP-037_N.webp", type: "トップス&ボトムス", dressName: "エンブレムつきセーラーマリントップス&スカート" },
  { id: "EP-038_N", name: "EP-038 N", rarity: "N", series: "promo", image: "images/cards/EP-038_N.webp", type: "シューズ", dressName: "ブルーワークブーツ" },

  // ========================================
  // パラレルカード
  //
  // 注意：
  // 既存カードの共有URL indexを壊さないため、
  // ここでは通常カードとは分離して登録する。
  //
  // 表示時に通常カードの直後へ挿入する。
  // ========================================

  { id: "E1-01_PR_p1", name: "E1-01 PR パラレル", rarity: "PR", series: "1", image: "images/cards/E1-01_PR_p1.webp", parallel: true, type: "トップス", dressName: "オーロラキネスキャミソール" },
  { id: "E1-02_PR_p1", name: "E1-02 PR パラレル", rarity: "PR", series: "1", image: "images/cards/E1-02_PR_p1.webp", parallel: true, type: "ボトムス", dressName: "オーロラキネスドレープスカート" },
  { id: "E1-03_PR_p1", name: "E1-03 PR パラレル", rarity: "PR", series: "1", image: "images/cards/E1-03_PR_p1.webp", parallel: true, type: "シューズ", dressName: "オーロラキネスバレエシューズ" },
  { id: "E1-04_PR_p1", name: "E1-04 PR パラレル", rarity: "PR", series: "1", image: "images/cards/E1-04_PR_p1.webp", parallel: true, type: "アクセサリー", dressName: "オーロラキネスリボン" },

  { id: "E1-30_ER_p1", name: "E1-30 ER パラレル", rarity: "ER", series: "1", image: "images/cards/E1-30_ER_p1.webp", parallel: true, type: "フルコーデ", dressName: "オデットスワン" },
  { id: "E1-31_ER_p1", name: "E1-31 ER パラレル", rarity: "ER", series: "1", image: "images/cards/E1-31_ER_p1.webp", parallel: true, type: "フルコーデ", dressName: "リルリボンストーリー" },
  { id: "E1-32_ER_p1", name: "E1-32 ER パラレル", rarity: "ER", series: "1", image: "images/cards/E1-32_ER_p1.webp", parallel: true, type: "フルコーデ", dressName: "オーロラペガサス" },

  { id: "E1-33_PR_p1", name: "E1-33 PR パラレル", rarity: "PR", series: "1", image: "images/cards/E1-33_PR_p1.webp", parallel: true, type: "トップス", dressName: "天の川コズミックツインショルダー" },
  { id: "E1-34_PR_p1", name: "E1-34 PR パラレル", rarity: "PR", series: "1", image: "images/cards/E1-34_PR_p1.webp", parallel: true, type: "ボトムス", dressName: "天の川コズミックスカート" },
  { id: "E1-35_PR_p1", name: "E1-35 PR パラレル", rarity: "PR", series: "1", image: "images/cards/E1-35_PR_p1.webp", parallel: true, type: "シューズ", dressName: "天の川コズミックブーツ" },
  { id: "E1-36_PR_p1", name: "E1-36 PR パラレル", rarity: "PR", series: "1", image: "images/cards/E1-36_PR_p1.webp", parallel: true, type: "アクセサリー", dressName: "天の川コズミックチューナー" },

  { id: "E1-50_ER_p1", name: "E1-50 ER パラレル", rarity: "ER", series: "1", image: "images/cards/E1-50_ER_p1.webp", parallel: true, type: "フルコーデ", dressName: "ドリームエミネンス" },
];