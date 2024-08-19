import React from "react";
import { Select, Space } from "antd";

interface SearchOrderMenuProps {
  handleOptionChange: (e: { target: { name: string; value: string } }) => void;
}

const SearchOrderMenu: React.FC<SearchOrderMenuProps> = ({
  handleOptionChange,
}) => {
  const handleChange = (value: string) => {
    handleOptionChange({
      target: {
        name: "order",
        value,
      },
    });
  };

  return (
    <div>
      <Space wrap>
        <Select
          defaultValue="LATEST"
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: "LATEST", label: "최신순" },
            { value: "POPULAR", label: "인기순" },
          ]}
        />
      </Space>
    </div>
  );
};

export default SearchOrderMenu;
