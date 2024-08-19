import React, { useEffect } from "react";
import { Switch } from "antd";
import { SearchSendCurricula } from "../../../interface/search/SearchInterface";

interface SearchSwitchProps {
  handleSearch: (e: React.FormEvent | null) => void;
  handleOptionChange: (e: { target: { name: string; value: boolean } }) => void;
  searchOption: SearchSendCurricula;
}

const SearchSwitch: React.FC<SearchSwitchProps> = ({
  handleOptionChange,
  handleSearch,
  searchOption,
}) => {
  const onChange = (checked: boolean) => {
    handleOptionChange({
      target: {
        name: "only_available",
        value: checked, // 스위치 상태와 동일하게 설정
      },
    });
  };

  useEffect(() => {
    handleSearch(null);
  }, [searchOption.only_available]);

  return (
    <div className="flex items-center">
      <label htmlFor="Switch" className="mx-2">
        수강 가능 여부
      </label>
      <Switch onChange={onChange} checked={searchOption.only_available} />
    </div>
  );
};

export default SearchSwitch;
