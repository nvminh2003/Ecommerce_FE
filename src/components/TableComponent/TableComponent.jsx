import { Button, Table } from "antd";
import React, { useMemo, useState } from "react";
import Loading from "../LoadingComponent/Loading";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

const TableComponent = (props) => {
    const {
        selectionType = "checkbox",
        data: dataSource = [],
        isLoading = false,
        columns = [],
        handleDeleteMany,
    } = props;
    const [rowSelectedKeys, setRowSelecteKeys] = useState([]);
    const newColumnsExport = useMemo(() => {
        const arr = columns?.filter((col) => col.dataIndex !== "action");
        return arr;
    }, [columns]);
    // console.log("new columns export", newColumnsExport);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelecteKeys(selectedRowKeys);
        },
    };

    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys);
    };

    // const handleExportExcel = () => {
    //     const excel = new Excel();
    //     excel
    //         .addSheet("test")
    //         .addColumns(newColumnsExport)
    //         .addDataSource(dataSource, {
    //             str2Percent: true,
    //         })
    //         .saveAs("Excel.xlsx");
    // };

    const handleExportExcel = () => {
        // Lọc các cột hiển thị trên bảng (các cột có dataIndex)
        const visibleColumns = columns.filter((col) => col.dataIndex);

        // Lấy danh sách các dataIndex cần xuất ra
        const columnsToExport = visibleColumns.map((col) => col.dataIndex);

        // Lọc dữ liệu (dataSource) chỉ lấy các trường có dataIndex trong visibleColumns
        const filteredDataSource = dataSource.map((row) => {
            const filteredRow = {};
            columnsToExport.forEach((dataIndex) => {
                if (row.hasOwnProperty(dataIndex)) {
                    filteredRow[dataIndex] = row[dataIndex];
                }
            });
            return filteredRow;
        });

        // Chuyển đổi dữ liệu thành sheet Excel
        const ws = XLSX.utils.json_to_sheet(filteredDataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Xuất file Excel
        XLSX.writeFile(wb, "Excel.xlsx");
    };

    return (
        <Loading isLoading={isLoading}>
            <div>
                <Button
                    type="dashed"
                    style={{ marginBottom: "10px", backgroundColor: "#d9d9d9" }}
                    shape="round"
                    icon={<DownloadOutlined />}
                    onClick={handleExportExcel}
                >
                    Export excel
                </Button>

                {rowSelectedKeys.length > 1 && (
                    <span
                        style={{
                            marginLeft: "10px",
                        }}
                        onClick={handleDeleteAll}
                    >
                        <Button type="primary" danger>
                            Xóa tất cả
                        </Button>
                    </span>
                )}

                {/* <button onClick={handleExportExcel}>Export excel</button> */}
            </div>

            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={dataSource}
                {...props}
            />
        </Loading>
    );
};

export default TableComponent;
