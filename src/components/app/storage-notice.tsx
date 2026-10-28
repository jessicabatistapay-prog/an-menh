"use client";

import { useAppData } from "@/hooks/use-app-data";
import { Note } from "./page-header";

/** Thông báo trạng thái bộ nhớ trình duyệt khi có vấn đề. */
export function StorageNotice({ always = false }: { always?: boolean }) {
  const { status, droppedCount } = useAppData();
  if (status === "loading") return null;
  if (status === "unavailable")
    return (
      <Note tone="warn">
        Trình duyệt đang chặn bộ nhớ cục bộ nên An Mệnh không thể lưu hồ sơ hay lịch sử. Bạn vẫn xem được mọi kết quả;
        hãy thử tắt chế độ duyệt riêng tư nghiêm ngặt nếu muốn lưu.
      </Note>
    );
  if (status === "corrupt-reset")
    return (
      <Note tone="warn">
        Dữ liệu đã lưu trước đó bị hỏng và không đọc được, nên An Mệnh đã bắt đầu lại với dữ liệu trống. Bản dữ liệu hỏng được
        giữ riêng trên trình duyệt và sẽ bị xóa khi bạn chọn “Xóa toàn bộ dữ liệu”.
      </Note>
    );
  if (status === "partially-recovered")
    return (
      <Note tone="warn">
        Có {droppedCount} mục dữ liệu bị lỗi nên đã được bỏ qua. Các mục còn lại vẫn đọc được bình thường và sẽ được lưu lại
        ở lần lưu tiếp theo.
      </Note>
    );
  if (status === "newer-version")
    return (
      <Note tone="warn">
        Dữ liệu trên trình duyệt này được tạo bởi phiên bản An Mệnh mới hơn. Bạn vẫn xem được, nhưng tạm thời không thể sửa để
        tránh làm hỏng dữ liệu. Hãy tải lại trang để dùng phiên bản mới.
      </Note>
    );
  if (always)
    return (
      <Note>
        Hồ sơ và lịch sử chỉ được lưu trên trình duyệt hiện tại khi bạn chọn lưu. Dữ liệu không gửi lên máy chủ và không tự
        đồng bộ giữa các thiết bị; xóa dữ liệu trình duyệt cũng sẽ xóa chúng.
      </Note>
    );
  return null;
}
