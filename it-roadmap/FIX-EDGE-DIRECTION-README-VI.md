# Sửa lỗi hướng kết nối giữa các cạnh

## Mô tả vấn đề

Trong ứng dụng IT Roadmap, sau khi lưu các kết nối cạnh và tải lại, hướng kết nối của cạnh bị đảo ngược. Ví dụ, kết nối ban đầu từ nút A đến nút B, sau khi tải lại trở thành kết nối từ nút B đến nút A.

## Nguyên nhân

1. **Vấn đề về tuần tự hóa dữ liệu**: Đối tượng cạnh (edge) trong thành phần React Flow chứa thông tin về sourceHandle và targetHandle, nhưng thông tin này bị mất khi lưu vào cơ sở dữ liệu.

2. **Thiếu trường trong cơ sở dữ liệu**: Bảng Edge không có các trường sourceHandle và targetHandle, dẫn đến không thể lưu đầy đủ thông tin kết nối cạnh.

3. **Xử lý API không đầy đủ**: API phía frontend và backend không xử lý và truyền đúng thông tin sourceHandle và targetHandle khi làm việc với dữ liệu cạnh.

## Giải pháp

1. **Cập nhật mô hình cơ sở dữ liệu**:

   - Thêm các trường sourceHandle và targetHandle vào bảng Edge
   - Tạo script di chuyển cơ sở dữ liệu để áp dụng các thay đổi này

2. **Cập nhật mã phía máy chủ**:

   - Sửa đổi mô hình Edge để hỗ trợ các trường mới
   - Cập nhật EdgeController và RoadmapController để xử lý các trường này
   - Đảm bảo lưu đúng thông tin handle khi tạo và cập nhật cạnh

3. **Cập nhật mã phía khách hàng**:
   - Sửa đổi các hàm getRoadmapEdges và updateRoadmapEdges trong roadmapService.js
   - Đảm bảo giữ lại thông tin handle khi tuần tự hóa và giải tuần tự hóa dữ liệu cạnh
   - Thêm ghi nhật ký chi tiết để dễ dàng gỡ lỗi

## Chi tiết kỹ thuật

1. **Thay đổi cơ sở dữ liệu**:

   ```prisma
   model Edge {
     // Các trường hiện có
     id             Int      @id @default(autoincrement())
     edgeIdentifier String   @unique
     source         String
     target         String
     // Các trường mới
     sourceHandle   String?
     targetHandle   String?
     // Các trường khác
     type           String?
     animated       Boolean  @default(false)
     // ...
   }
   ```

2. **Xử lý phía máy chủ**:

   - Khi tạo và cập nhật cạnh, bây giờ sẽ xử lý các trường sourceHandle và targetHandle
   - Khi cập nhật hàng loạt các cạnh, đảm bảo các trường này được truyền và lưu đúng cách

3. **Xử lý phía khách hàng**:
   - Khi lưu cạnh, đảm bảo sourceHandle và targetHandle được bao gồm trong dữ liệu gửi đến máy chủ
   - Khi tải cạnh, đảm bảo các trường này được áp dụng đúng cách vào thành phần React Flow

## Cách xác minh sửa lỗi

1. Tạo một roadmap mới
2. Thêm nhiều nút và tạo kết nối giữa chúng
3. Lưu roadmap
4. Làm mới trang hoặc tải lại roadmap
5. Xác minh tất cả các kết nối có cùng hướng như trước khi lưu

## Lưu ý

- Sửa lỗi này yêu cầu di chuyển cơ sở dữ liệu, vui lòng đảm bảo chạy script di chuyển trước khi triển khai
- Đối với các roadmap hiện có, có thể cần tạo lại kết nối để đảm bảo hướng đúng
