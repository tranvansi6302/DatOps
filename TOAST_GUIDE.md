# Toast Notifications Usage Guide

## Import

```tsx
import { showSuccess, showError, showWarning, showInfo } from "./utils/toast";
```

## Available Functions

### 1. showSuccess(message: string)

Hiển thị thông báo thành công (màu xanh lá)

**Ví dụ:**

```tsx
showSuccess("Configuration saved!");
showSuccess(`Loaded ${allTasks.length} tasks successfully!`);
showSuccess("✅ Connection Successful!\n\nDetail Sheet: MySheet");
```

**Khi nào sử dụng:**

- Khi thao tác hoàn thành thành công
- Khi lưu dữ liệu thành công
- Khi kết nối thành công

---

### 2. showError(message: string)

Hiển thị thông báo lỗi (màu đỏ)

**Ví dụ:**

```tsx
showError("Invalid JSON format.");
showError("Submit failed!");
showError("❌ Connection Failed\n\nScript URL: Failed to connect");
```

**Khi nào sử dụng:**

- Khi có lỗi xảy ra
- Khi validation thất bại
- Khi API call thất bại

---

### 3. showWarning(message: string)

Hiển thị thông báo cảnh báo (màu vàng/cam)

**Ví dụ:**

```tsx
showWarning("Please paste JSON.");
showWarning("No tasks to submit.");
showWarning("⚠️ Partial Success\n\nDetail Sheet: MySheet\n❌ Some errors");
```

**Khi nào sử dụng:**

- Khi cần cảnh báo người dùng
- Khi có vấn đề nhưng không nghiêm trọng
- Khi thiếu dữ liệu đầu vào

---

### 4. showInfo(message: string)

Hiển thị thông báo thông tin (màu xanh dương)

**Ví dụ:**

```tsx
showInfo("Processing your request...");
showInfo("Please wait while we sync your data.");
```

**Khi nào sử dụng:**

- Khi cần thông báo thông tin chung
- Khi hướng dẫn người dùng
- Khi cập nhật trạng thái

---

## Configuration

Tất cả toast notifications đã được cấu hình sẵn với:

- **Position**: `top-right` (góc trên bên phải)
- **Auto Close**: 3-4 giây (tùy loại)
- **Progress Bar**: Hiển thị
- **Close on Click**: Có
- **Draggable**: Có thể kéo
- **Pause on Hover**: Tạm dừng khi hover
- **Theme**: Dark (phù hợp với UI)

## Thay Đổi Từ Alert

### Trước đây (Browser Alert)

```tsx
alert("Configuration saved!");
alert("Invalid JSON format.");
alert("Please paste JSON.");
```

**Nhược điểm:**

- ❌ Chặn UI (blocking)
- ❌ Không đẹp
- ❌ Không thể tùy chỉnh
- ❌ Không có màu sắc phân biệt
- ❌ Phải click OK mới đóng

### Bây giờ (React Toastify)

```tsx
showSuccess("Configuration saved!");
showError("Invalid JSON format.");
showWarning("Please paste JSON.");
```

**Ưu điểm:**

- ✅ Không chặn UI (non-blocking)
- ✅ Giao diện đẹp, hiện đại
- ✅ Có thể tùy chỉnh
- ✅ Màu sắc phân biệt rõ ràng
- ✅ Tự động đóng sau vài giây
- ✅ Có thể hiển thị nhiều toast cùng lúc
- ✅ Có progress bar
- ✅ Có animation mượt mà

## Multi-line Messages

Toast hỗ trợ hiển thị nhiều dòng:

```tsx
showSuccess(`✅ Connection Successful!

Detail Sheet: ${detailSheetName}
Leader Sheet: ${leaderSheetName}
Google Doc: ${docName}`);
```

## Best Practices

1. **Sử dụng icon/emoji** để làm nổi bật:

   ```tsx
   showSuccess("✅ Connection Successful!");
   showError("❌ Connection Failed");
   showWarning("⚠️ Partial Success");
   ```

2. **Cung cấp thông tin cụ thể**:

   ```tsx
   // ❌ Không tốt
   showError("Error!");

   // ✅ Tốt
   showError(
     "Failed to connect to Google Sheets. Please check your Script URL.",
   );
   ```

3. **Sử dụng đúng loại toast**:
   - Success: Cho thành công
   - Error: Cho lỗi
   - Warning: Cho cảnh báo
   - Info: Cho thông tin

4. **Giữ message ngắn gọn** (nếu có thể):

   ```tsx
   // ✅ Tốt
   showSuccess("Configuration saved!");

   // ⚠️ Quá dài
   showSuccess(
     "Your configuration has been successfully saved to the local storage and will be used for all future connections to Google Sheets.",
   );
   ```

## Customization (Nếu cần)

Nếu cần tùy chỉnh thêm, có thể sửa trong `src/utils/toast.ts`:

```tsx
export const showSuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000, // Thay đổi thời gian tự đóng
    hideProgressBar: false, // Ẩn/hiện progress bar
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
```
