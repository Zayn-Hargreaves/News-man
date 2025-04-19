import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../../utils/token.utils";
import { base_url } from "../../../config/config";
import roleService from "../../../service/roleService"
import permissionService from "../../../service/permissionService";
const Permission = () => {
  const [roles, setRoles] = useState([]); // Danh sách vai trò
  const [permissions, setPermissions] = useState([]); // Danh sách quyền
  const [rolePermissions, setRolePermissions] = useState({}); // Quan hệ role-permission

  useEffect(() => {
    // Lấy dữ liệu từ backend
    const fetchData = async () => {
      try {


        // Lấy danh sách roles, permissions và role-permissions
        const [rolesRes, permissionsRes, rolePermissionsRes] = await Promise.all([
          await roleService.fetchRole(),
          await permissionService.fetchPermission(),
          await permissionService.fetchRolePermission()
        ]);
        setRoles(rolesRes.data.metadata.metadata);
        setPermissions(permissionsRes.data.metadata.metadata);

        // Chuyển đổi role-permissions thành object dễ tra cứu
        const rolePermMap = {};
        rolePermissionsRes.data.metadata.metadata.forEach((rp) => {
          if (!rolePermMap[rp.RoleId]) rolePermMap[rp.RoleId] = {};
          rolePermMap[rp.RoleId][rp.PermissionId] = true;
        });
        setRolePermissions(rolePermMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Xử lý khi toggle checkbox
  const handleTogglePermission = async (roleId, permissionId) => {
    setRolePermissions((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permissionId]: !prev[roleId]?.[permissionId],
      },
    }));
  };

  // Cập nhật tất cả quyền hạn
  const handleUpdatePermissions = async () => {
    try {

      // Gửi yêu cầu API để cập nhật quyền hạn
      const requests = [];
      Object.keys(rolePermissions).forEach((roleId) => {
        Object.keys(rolePermissions[roleId]).forEach((permissionId) => {
          const hasPermission = rolePermissions[roleId][permissionId];
          const data = { roleId, permissionId };

          if (hasPermission) {
            // Thêm quyền
            requests.push(permissionService.addPermission(data));
          } else {
            // Xóa quyền
            requests.push(permissionService.deletePermission(data));
          }
        });
      });

      // Chờ tất cả các yêu cầu hoàn thành
      await Promise.all(requests);
      alert("Cập nhật quyền thành công!");
    } catch (error) {
      console.error("Error updating permissions:", error);
      alert("Đã có lỗi khi cập nhật quyền!");
    }
  };
  console.log(rolePermissions)
  return (
    <div className="mt-5 p-5 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-6">Manage Role Permissions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-6 py-3 text-left text-gray-700">Permission</th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  className="border border-gray-300 px-6 py-3 text-center text-gray-700"
                >
                  {role.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr key={permission.id} className="even:bg-gray-50">
                <td className="border border-gray-300 px-6 py-4 text-gray-700">
                  {permission.title}
                </td>
                {roles.map((role) => (
                  <td
                    key={role.id}
                    className="border border-gray-300 px-6 py-4 text-center"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      checked={!!rolePermissions[role.id]?.[permission.id]}
                      onChange={() => handleTogglePermission(role.id, permission.id)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Nút cập nhật quyền */}
      <div className="mt-4 text-right">
        <button
          onClick={handleUpdatePermissions}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Permission;
