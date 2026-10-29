# An Mệnh

Web app tiếng Việt tra cứu bản mệnh, ngũ hành, phong thủy Bát trạch, thần số học và rút thẻ chiêm nghiệm.
Ưu tiên điện thoại, chạy hoàn toàn trên trình duyệt: không tài khoản, không database, không API trả phí.

> Nội dung mang tính tham khảo văn hóa và giải trí.

## Tính năng

| Trang | Đường dẫn | Nội dung |
| --- | --- | --- |
| Trang chủ | `/` | Ngày dương và âm lịch hôm nay (giờ Việt Nam), lối vào các tính năng, hồ sơ và kết quả đã lưu gần đây |
| Bản mệnh | `/ban-menh` | Năm âm lịch, Can Chi, con giáp, nạp âm, quan hệ sinh khắc, màu tham khảo, cung phi (khi có giới tính) |
| Phong thủy | `/phong-thuy` | Cung phi, nhóm Đông/Tây tứ mệnh, sao của hướng nhà, trạch của nhà, sơ đồ 8 hướng, gợi ý cho phòng khách/phòng ngủ/góc làm việc |
| Thần số học | `/than-so-hoc` | Số chủ đạo với từng bước cộng, điểm mạnh, xu hướng cần cân bằng, câu hỏi suy ngẫm, năm cá nhân |
| Lịch âm dương | `/lich` | Lịch tháng có ngày âm, Can Chi ngày/tháng/năm, 24 tiết khí, ngày lễ; đổi ngày dương ↔ âm |
| Xem tuổi | `/hop-tuoi` | Tam hợp, lục hợp, lục xung, lục hại, can hợp, sinh khắc nạp âm, nhóm Bát trạch của hai người – không chấm điểm |
| Rút thẻ | `/rut-the` | 24 thẻ tự biên soạn, hiệu ứng lật thẻ (tắt khi `prefers-reduced-motion`), lưu vào lịch sử |
| Hồ sơ | `/ho-so` | Thêm, sửa, xóa hồ sơ; xem lại/xóa từng mục lịch sử; xóa toàn bộ dữ liệu |
| Kiến thức | `/kien-thuc` | Ngũ hành, Can Chi, nạp âm và cung phi, Bát trạch, thần số học, giới hạn |
| Phương pháp | `/phuong-phap` | Thuật toán, bảng tra, nguồn, phạm vi và kết quả đối chiếu |

Nhạc nền: tạo trực tiếp bằng Web Audio API theo thang âm ngũ cung (`src/lib/audio/ambient.ts`), không có file nhạc và
không vướng bản quyền. Mặc định bật, nhưng theo chính sách tự phát của trình duyệt, nhạc chỉ bắt đầu sau lần chạm hoặc
nhấn phím đầu tiên. Nút ở góc màn hình để bật/tắt; lựa chọn lưu ở khóa `an-menh:nhac`.

Kết quả đã lưu được mở lại bằng `?muc=<id>`, hồ sơ bằng `?ho-so=<id>`. Đường dẫn chỉ chứa id, không chứa ngày sinh.

## Công nghệ

Next.js 16.4 (App Router, Cache Components) · React 19 · TypeScript strict · Tailwind CSS 4 · thành phần kiểu shadcn/ui
(viết tay theo cấu trúc shadcn trên `radix-ui`, vì môi trường build không truy cập được registry) · Lucide · React Hook Form + Zod ·
Vitest · LocalStorage · PWA (manifest, icon, service worker). Font Be Vietnam Pro và Cormorant Garamond được đóng gói qua
`@fontsource`, không gọi Google Fonts lúc chạy.

## Chạy local

Yêu cầu Node.js 20.9+ (đã kiểm tra với Node 22).

```bash
npm install
npm run dev          # http://localhost:3000
```

## Kiểm tra và build

```bash
npm run lint
npm run typecheck
npm test             # Vitest – logic tính toán, lưu trữ, bộ thẻ
npm run build
npm start            # chạy bản production
npm run check        # chạy cả bốn bước trên
```

Đối chiếu bộ chuyển đổi âm lịch với hai thư viện bên ngoài (không phải dependency của app):

```bash
mkdir -p /tmp/xcheck && (cd /tmp/xcheck && npm init -y && npm i amlich lunar-javascript)
XCHECK_DIR=/tmp/xcheck npm run verify:lunar
```

## Triển khai

Mọi trang được prerender tĩnh; không cần biến môi trường hay khóa API.

### Netlify

Dự án đã có sẵn `netlify.toml` (lệnh build, Node 22). Netlify tự nhận diện Next.js và dùng adapter OpenNext
(`@netlify/plugin-nextjs`), không cần cài thêm gì.

**Cách 1 – qua GitHub (khuyên dùng, tự triển khai lại mỗi lần push):**

1. Đưa mã nguồn lên một repository GitHub/GitLab/Bitbucket.
2. Trên app.netlify.com chọn *Add new project → Import an existing project*, chọn repository.
3. Giữ nguyên cấu hình Netlify tự điền (lệnh build `npm run build`) rồi bấm *Deploy*.

**Cách 2 – bằng Netlify CLI từ máy của bạn:**

```bash
npm install -g netlify-cli
netlify login
netlify init        # tạo project mới hoặc liên kết project có sẵn
netlify deploy --build          # bản xem thử (Draft URL)
netlify deploy --build --prod   # bản chính thức
```

Kiểm tra build theo đúng môi trường Netlify trên máy: `netlify build --offline`.

Lưu ý: không dùng kiểu kéo thả thư mục lên Netlify Drop – cách đó chỉ phục vụ file tĩnh, không chạy adapter Next.js.

### Vercel hoặc máy chủ Node

- **Vercel**: import repository, giữ cấu hình mặc định.
- **Máy chủ Node riêng**: `npm ci && npm run build && npm start` (cổng qua biến `PORT`), đặt sau HTTPS.

Service worker và chức năng cài đặt PWA chỉ hoạt động qua HTTPS (hoặc `localhost`).

## Cấu trúc

```
src/
  app/                 # các route, layout, manifest, icon
  components/
    ui/                # button, input, dialog, alert-dialog, dropdown-menu, radio-group, checkbox
    app/               # header, thanh điều hướng dưới, đồ hình ngũ hành, trường biểu mẫu, nút lưu
    ban-menh/ phong-thuy/ than-so/ rut-the/ ho-so/ home/
  hooks/use-app-data.ts   # useSyncExternalStore trên kho LocalStorage
  lib/
    core/              # logic tính toán thuần TypeScript, không phụ thuộc UI
      date.ts lunar.ts canchi.ts napam.ts elements.ts battrach.ts numerology.ts banmenh.ts
      __tests__/
    storage/           # lược đồ Zod, kho dữ liệu, xử lý lỗi và phiên bản
    content/           # thẻ chiêm nghiệm, diễn giải, gợi ý không gian (tự biên soạn)
scripts/verify-lunar/  # đối chiếu âm lịch toàn phạm vi
public/sw.js           # service worker
```

## Phương pháp tính

**Âm lịch.** Tự triển khai trong `src/lib/core/lunar.ts`: thời điểm sóc và kinh độ Mặt Trời theo công thức gần đúng của
Jean Meeus (*Astronomical Algorithms*, 1998), quy tắc lập lịch âm Việt Nam như Hồ Ngọc Đức mô tả, múi giờ UTC+7.
Ngày sinh được xử lý như ngày lịch (năm, tháng, ngày), không qua `Date`/UTC. Phạm vi: 31/01/1900 – 31/12/2100.

Không dùng thư viện có sẵn vì: bản JS phổ biến của chương trình Hồ Ngọc Đức (`amlich`) ghi giấy phép
*"personal, non-commercial use"*; các thư viện lịch Trung Quốc tính theo UTC+8 nên lệch lịch Việt Nam ở một số năm
(Tết 1985, 2007, 2030).

**Can Chi.** Năm theo năm âm lịch (chuyển năm tại Tết): can = (năm+6) mod 10, chi = (năm+8) mod 12. Ngày theo số ngày
Julius, tháng theo can năm.

**Nạp âm.** Bảng 30 cặp truyền thống (Tam Mệnh Thông Hội).

**Cung phi.** Theo năm âm lịch, quy ước Tết (không dùng Lập Xuân). Nam: k = (11 − năm mod 9) mod 9; nữ:
k = (năm mod 9 + 4) mod 9; 0 → 9; số 5: nam → Khôn, nữ → Cấn.

**Bát trạch.** Bảng du niên 8 cung × 8 hướng; hướng nhà là hướng mặt nhà, trạch của nhà xét theo hướng tọa.

**Thần số học.** Cộng mọi chữ số của DD MM YYYY; giữ 11, 22, 33 (kể cả ở bước trung gian); còn lại rút gọn về 1–9.

**Đổi âm sang dương.** Đi từ Tết của năm âm, cộng dần độ dài từng tháng, rồi kiểm tra ngược bằng phép đổi dương sang âm.

**Tiết khí.** Ngày (giờ VN) Mặt Trời qua mốc kinh độ bội số 15°, Xuân phân = 0°.

**Xem tuổi.** Tam hợp (chi mod 4), lục hợp (tổng ≡ 1 mod 12), lục xung (cách 6), lục hại (tổng ≡ 7 mod 12), can hợp (cách 5).

**Năm cá nhân.** Cộng chữ số DD MM + năm đang xét, rút gọn về 1–9 (không giữ 11/22/33).

**Lưu trữ.** Khóa `an-menh:data`, lược đồ phiên bản 2 (tự chuyển từ phiên bản 1) kiểm tra bằng Zod. JSON hỏng → sao lưu sang `an-menh:data:hong`
rồi khởi tạo lại; mục lỗi bị bỏ qua từng mục; dữ liệu phiên bản mới hơn chỉ đọc, không ghi đè; LocalStorage bị chặn →
vẫn xem được kết quả, nút lưu báo lỗi rõ ràng. Chỉ lưu khi người dùng chọn lưu, và chỉ lưu đầu vào (kết quả được tính lại).

## Kiểm thử đã có

- Tết 1900–2030 (25 năm) và ngày liền trước Tết; khác biệt VN/TQ năm 1968, 1985, 2007, 2030.
- Tháng nhuận 2020 (4), 2023 (2), 2025 (6); năm 2024 không nhuận; ngày 29/02/2024.
- Tính nhất quán trên mọi ngày 1900–2100 (ngày tăng liên tục, tháng 29–30 ngày, năm 12–13 tháng).
- Ngày không hợp lệ (29/02/2023, 31/04, tháng 13), ngoài phạm vi, chuỗi rỗng, sai định dạng.
- Can Chi năm/tháng/ngày; bảng nạp âm đủ và đúng thứ tự; 9 năm nạp âm cụ thể.
- Cung phi: 11 trường hợp cụ thể, số 5, đối chiếu bảng tra truyền thống cho mọi năm 1900–2099, sinh trước/sau Tết.
- Bát trạch: đủ 8 hướng mỗi cung, Phục Vị đúng quẻ, quan hệ đối xứng, hướng thuận cùng nhóm.
- Thần số học: số 11/22/33, dừng ở bước trung gian, bước tính, ngày nhuận.
- Lưu trữ: JSON hỏng, thiếu phiên bản, phiên bản mới hơn, mục lỗi, trùng id, LocalStorage bị chặn, hết dung lượng.
- Bộ thẻ: đủ 24 thẻ, không trùng, nội dung đầy đủ.
- Đổi âm ↔ dương khớp ngược trên mọi ngày 1900–2100; ngày âm không tồn tại bị từ chối; tháng nhuận 2020/2023/2025.
- Tiết khí: các mốc Xuân phân, Hạ chí, Thu phân, Đông chí, Lập xuân đã biết; mỗi năm 1901–2099 đủ 24 tiết đúng thứ tự,
  Đông chí luôn thuộc tháng 11 âm.
- Ngày lễ, quan hệ tuổi (mỗi chi đủ 2 tam hợp/1 lục hợp/1 xung/1 hại), năm cá nhân, chuyển dữ liệu v1 → v2.

Kết quả đối chiếu âm lịch (73.384 ngày): khớp `amlich` ở UTC+7 trừ 2 ngày mà `amlich` trả về "ngày 0"
(07/05/2054, 09/04/2062); khác `lunar-javascript` ở UTC+8 tại 150 ngày thuộc 5 giai đoạn (1914, 1916, 1920, 2057, 2097)
khi sóc hoặc trung khí rơi sát nửa đêm.

## Giới hạn

- Công thức thiên văn là bản gần đúng; ở vài thời điểm sóc/trung khí sát nửa đêm, kết quả có thể lệch một ngày so với
  lịch tính bằng mô hình chính xác hơn.
- Lịch âm Việt Nam trước 1968 (miền Nam đến 1975) thường dùng UTC+8. App dùng UTC+7 thống nhất và hiển thị lưu ý khi
  hai cách tính khác nhau cho ngày sinh trước 1976.
- Chưa có: lá số tử vi, chỉ số thần số học theo tên, xem ngày tốt xấu, giờ hoàng đạo, đăng nhập/đồng bộ, la bàn cảm biến.
- Dữ liệu chỉ nằm trên trình duyệt hiện tại; xóa dữ liệu trình duyệt sẽ mất hồ sơ và lịch sử.
- Diễn giải, thẻ chiêm nghiệm và gợi ý không gian do An Mệnh tự biên soạn.
