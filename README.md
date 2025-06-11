# DACS

PERN stack

# Ghi chép sửa lỗi ứng dụng IT Roadmap

## Vấn đề: Không lưu được các node và liên kết trên sơ đồ lộ trình

Chúng tôi đã sửa một lỗi quan trọng: khi tạo các node và liên kết trong trình soạn thảo lộ trình, dữ liệu không được lưu chính xác vào cơ sở dữ liệu.

### Các vấn đề chính

1. **Vấn đề tuần tự hóa dữ liệu**: Khi lưu các node và liên kết React Flow, có các tham chiếu React DOM và tham chiếu vòng, dẫn đến lỗi khi tuần tự hóa JSON
2. **Vấn đề bất đồng bộ**: Nhiều lệnh gọi API bất đồng bộ không được phối hợp đúng cách, gây ra không nhất quán dữ liệu
3. **Vấn đề xác thực dữ liệu**: Không xác thực và làm sạch dữ liệu node và liên kết đúng cách
4. **Vấn đề tham chiếu**: Các node và liên kết được tạo không được lưu kịp thời

### Giải pháp

1. **Làm sạch dữ liệu**: Tạo hàm `saveChanges`, làm sạch dữ liệu node và liên kết trước khi lưu:

   - Loại bỏ tham chiếu React và DOM
   - Chỉ giữ lại các thuộc tính dữ liệu cần thiết
   - Xác thực tất cả các trường bắt buộc

2. **Sử dụng forwardRef**: Sử dụng forwardRef của React để hiển thị chức năng nội bộ, cho phép component cha gọi phương thức lưu của component con

3. **Tự động lưu**: Sửa đổi các hàm `handleAddCourse` và `onConnect`, tự động lưu thay đổi sau khi thêm node hoặc liên kết

4. **Xử lý bất đồng bộ**: Cải thiện xử lý bất đồng bộ của các lệnh gọi API, đảm bảo tất cả các thao tác được thực hiện theo đúng thứ tự

5. **Xử lý lỗi mạnh mẽ**: Thêm bắt lỗi toàn diện và ghi nhật ký, giúp dễ dàng chẩn đoán vấn đề

6. **Xác thực dữ liệu**: Tăng cường logic xác thực dữ liệu ở cả máy chủ và máy khách, đảm bảo định dạng dữ liệu chính xác

### Các tệp đã sửa đổi

1. `RoadmapView.jsx` - Thêm cơ chế làm sạch dữ liệu và phương thức saveChanges
2. `RoadmapEditPage.jsx` - Cải thiện cách tương tác với component RoadmapView
3. `roadmapService.js` - Tăng cường độ mạnh mẽ và xử lý lỗi của dịch vụ API

### Kết quả

Giờ đây, sau khi chỉnh sửa lộ trình, dữ liệu có thể được lưu chính xác và tải lại, tất cả các node và liên kết do người dùng tạo đều được lưu trữ vào cơ sở dữ liệu.
