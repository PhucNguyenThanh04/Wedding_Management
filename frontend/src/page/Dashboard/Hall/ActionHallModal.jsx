import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useTheme } from "../../../context/themeContext";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHall, updateHall } from "../../../apis/hall.api";
import { toast } from "react-toastify";
import { Form, Input, InputNumber, Switch, Button, Select } from "antd";
import { PictureOutlined } from "@ant-design/icons";

function ActionHallModal({ onClose, action, dataUpdate }) {
  const { t } = useTheme();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  useEffect(() => {
    if (action === "edit" && dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name ?? "",
        location: dataUpdate.location ?? "",
        capacity: dataUpdate.capacity ?? null,
        min_tables: dataUpdate.min_tables ?? null,
        max_tables: dataUpdate.max_tables ?? null,
        price_per_table: dataUpdate.price_per_table ?? null,
        is_available: dataUpdate.is_available ?? true,
        description: dataUpdate.description ?? "",
        image_url: dataUpdate.image_url ?? "",
      });
    } else {
      form.resetFields();
      form.setFieldValue("is_available", true);
    }
  }, [action, dataUpdate, form]);

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: (payload) => createHall(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("Thêm sảnh mới thành công!");
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra!");
    },
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: (payload) => updateHall(dataUpdate.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("Cập nhật sảnh thành công!");
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra!");
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        name: values.name.trim(),
        location: values.location.trim(),
        description: values.description?.trim() ?? "",
        image_url: values.image_url?.trim() ?? "",
      };
      if (action === "add") {
        create(payload);
      } else {
        update(payload);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full z-[999] h-full flex items-center justify-center bg-[#3535356a]"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-[66rem] h-auto p-10 rounded-md relative"
        style={{ background: t.surface }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 hover:text-red-500 transition-colors"
        >
          <FontAwesomeIcon icon={faClose} className="text-[1.8rem]" />
        </button>

        <div className="space-y-1 mb-8">
          <h2 className="text-[2.2rem] font-semibold">
            {action === "add" ? "Thêm sảnh mới" : "Cập nhật sảnh"}
          </h2>
          <p className="text-gray-500 text-[1.4rem]">
            {action === "add"
              ? "Điền đầy đủ thông tin để thêm sảnh mới."
              : "Chỉnh sửa thông tin sảnh."}
          </p>
        </div>

        <div className="max-h-[50rem] overflow-auto pr-1">
          <Form form={form} layout="vertical" requiredMark={false}>
            <div className="grid grid-cols-2 gap-x-5">
              <Form.Item
                label={
                  <span className="text-[1.4rem] font-medium text-gray-700">
                    Tên sảnh
                  </span>
                }
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên sảnh" }]}
              >
                <Input
                  placeholder="VD: Sảnh Kim Cương"
                  size="large"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[1.4rem] font-medium text-gray-700">
                    Vị trí
                  </span>
                }
                name="location"
                rules={[{ required: true, message: "Vui lòng chọn vị trí" }]}
              >
                <Select
                  placeholder="Chọn tầng"
                  size="large"
                  className="w-full"
                  options={[
                    { value: "Tầng 1", label: "Tầng 1" },
                    { value: "Tầng 2", label: "Tầng 2" },
                    { value: "Tầng 3", label: "Tầng 3" },
                    { value: "Tầng 4", label: "Tầng 4" },
                    { value: "Tầng 5", label: "Tầng 5" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[1.4rem] font-medium text-gray-700">
                    Sức chứa (người)
                  </span>
                }
                name="capacity"
                rules={[
                  { required: true, message: "Vui lòng nhập sức chứa" },
                  {
                    type: "number",
                    min: 1,
                    message: "Sức chứa phải lớn hơn 0",
                  },
                ]}
              >
                <InputNumber
                  placeholder="VD: 200"
                  min={1}
                  size="large"
                  className="w-full rounded-md"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[1.4rem] font-medium text-gray-700">
                    Số bàn tối thiểu
                  </span>
                }
                name="min_tables"
                dependencies={["max_tables"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số bàn tối thiểu",
                  },
                  { type: "number", min: 0, message: "Không được nhỏ hơn 0" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const max = getFieldValue("max_tables");
                      if (value == null || max == null || value <= max) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Số bàn tối thiểu không được lớn hơn tối đa"),
                      );
                    },
                  }),
                ]}
              >
                <InputNumber
                  placeholder="VD: 5"
                  min={0}
                  size="large"
                  className="w-full rounded-md"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[1.4rem] font-medium text-gray-700">
                    Số bàn tối đa
                  </span>
                }
                name="max_tables"
                dependencies={["min_tables"]}
                rules={[
                  { required: true, message: "Vui lòng nhập số bàn tối đa" },
                  { type: "number", min: 1, message: "Phải lớn hơn 0" },
                ]}
              >
                <InputNumber
                  placeholder="VD: 20"
                  min={1}
                  size="large"
                  style={{ width: "100%" }}
                  className="w-full rounded-md"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[1.4rem] font-medium text-gray-700">
                    Giá / Bàn (VNĐ)
                  </span>
                }
                name="price_per_table"
                rules={[
                  { required: true, message: "Vui lòng nhập giá bàn" },
                  { type: "number", min: 1, message: "Giá phải lớn hơn 0" },
                ]}
              >
                <InputNumber
                  placeholder="VD: 500000"
                  min={1}
                  size="large"
                  className="w-full rounded-md"
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(v) => v?.replace(/,/g, "")}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <div className="col-span-2">
                <Form.Item
                  label={
                    <span className="text-[1.4rem] font-medium text-gray-700">
                      Mô tả
                    </span>
                  }
                  name="description"
                >
                  <Input.TextArea
                    placeholder="Mô tả ngắn về sảnh..."
                    rows={3}
                    className="rounded-md resize-none"
                  />
                </Form.Item>
              </div>

              <div className="col-span-2">
                <Form.Item
                  label={
                    <span className="text-[1.4rem] font-medium text-gray-700">
                      <PictureOutlined className="mr-2" />
                      URL Hình ảnh
                    </span>
                  }
                  name="image_url"
                >
                  <Input
                    placeholder="https://example.com/image.jpg"
                    size="large"
                    className="rounded-md"
                  />
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prev, cur) => prev.image_url !== cur.image_url}
                >
                  {({ getFieldValue }) => {
                    const url = getFieldValue("image_url");
                    return url ? (
                      <div className="-mt-4 mb-4">
                        <img
                          src={url}
                          alt="Preview"
                          className="h-24 w-auto rounded-md object-cover border border-gray-200"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </div>
                    ) : null;
                  }}
                </Form.Item>
              </div>

              <div className="col-span-2">
                <Form.Item
                  label={
                    <span className="text-[1.4rem] font-medium text-gray-700">
                      Trạng thái
                    </span>
                  }
                  name="is_available"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Còn trống"
                    unCheckedChildren="Đang hoạt động"
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            onClick={onClose}
            disabled={isPending}
            size="large"
            className="px-8 rounded-md border-gray-300 text-gray-700 hover:!border-gray-400"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isPending}
            size="large"
            className="px-8 rounded-md bg-blue-500 hover:!bg-blue-600 border-none"
          >
            {action === "add" ? "Thêm sảnh" : "Cập nhật"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ActionHallModal;
