import { Form, Input, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import './DataGrid.less';
import Nbsp from './Nbsp';

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  onSave,
  ...props
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(state => !state);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    });
  }

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      onSave({ ...record, ...values });
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
        <div className='editable-cell-value-wrap' onClick={toggleEdit}>
          <Nbsp />{children}
        </div>
      );
  }

  return <td {...props}>{childNode}</td>;
};

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell
  }
}

const DataGrid = ({
  columns,
  dataSource,
  selectedRow,
  onChange,
  ...props
}) => {
  const formattedColumns = columns.map(column => {
    if (!column.editable) {
      return column;
    }

    return {
      ...column,
      onCell: record => ({
        record,
        editable: column.editable,
        dataIndex: column.dataIndex,
        title: column.title,
        onSave: onChange
      })
    }
  });

  return (
    <Table
      components={components}
      rowClassName={record => {
        const style = s => s ? ` ${s}` : '';
        const selectableRow = selectedRow && style('selectable-row');
        const selectedStyle = selectedRow && record[selectedRow.key] === selectedRow.value && style('ant-table-row-selected');
        return `editable-row${selectedStyle}${selectableRow}`;
      }}
      bordered
      dataSource={dataSource}
      columns={formattedColumns}
      pagination={{ size: 'small' }}
      {...props}
    />
  );
};

export default DataGrid;