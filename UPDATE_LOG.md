# Cập Nhật Mới - Loading Screen & Google Doc Display

## Ngày: 2026-02-05

### ✨ Improvements

#### 1. **Cải Thiện UI Loading Screen**

- ✅ Căn giữa (centered) message và icon loading.
- ✅ Tăng khoảng cách (gap) giữa các phần tử giúp dễ nhìn hơn.
- ✅ Thêm **Nút Hủy (Cancel)** cho phép người dùng dừng quá trình loading/pushing nếu chờ quá lâu.

**Chi tiết**:

- Nút "Cancel" chỉ hiện khi cần thiết.
- Khi nhấn Cancel trong quá trình "Push Cloud":
  - Dừng loading screen ngay lập tức.
  - Hiển thị cảnh báo "Operation cancelled".

### 🐛 Bug Fixes

#### Fix lỗi `e.preventDefault is not a function`

- ✅ Sửa lỗi crash khi click nút Push Cloud.

### ✨ Tính Năng Mới (Đã cập nhật trước đó)

#### 1. **Loading Screen Khi Import/Submit**

- ✅ Fullscreen loading, đẹp, chuyên nghiệp.

#### 2. **Hiển Thị Google Doc Trong Dashboard**

- ✅ 3 cột: Detail Sheet | Leader Sheet | Google Doc.

### ✅ Build Status

```
✓ Build thành công
✓ Không có TypeScript errors
✓ Không có lint errors
✓ Bundle size: 265.13 kB
```
