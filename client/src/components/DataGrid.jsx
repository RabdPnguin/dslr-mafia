import { Form, Input, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import './DataGrid.less';
import Nbsp from './Nbsp';

const EditableContext = React.createContext();

const HeaderCell = ({ visible, className = '', children }) => {
  return visible ? (
    <th className={`ant-table-cell ${className}`}>
      {children}
    </th >
  ) : null;
};

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
  visible,
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

  const td = <td {...props} >{childNode}</td>;

  return typeof childNode[1] === 'object'
    ? td
    : visible ? td : null;
};

const components = {
  header: {
    cell: HeaderCell
  },
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
  rowClassName,
  ...props
}) => {
  const formattedColumns = columns.map(column => {
    const {
      editable = false,
      visible = true,
      dataIndex,
      title,
    } = column;

    return {
      ...column,
      onHeaderCell: record => ({
        record,
        visible
      }),
      onCell: record => ({
        record,
        editable,
        visible,
        dataIndex,
        title,
        onSave: onChange
      })
    }
  });

  return (
    <Table
      size='small'
      components={components}
      rowClassName={record => {
        const style = s => s ? ` ${s}` : '';
        const selectableRow = selectedRow && style('selectable-row');
        const selectedStyle = selectedRow && record[selectedRow.key] === selectedRow.value && style('ant-table-row-selected');
        return `editable-row${selectedStyle}${selectableRow} ${rowClassName?.(record)}`.trim();
      }}
      bordered={false}
      dataSource={dataSource}
      columns={formattedColumns}
      pagination={{ size: 'small' }}
      {...props}
    />
  );
};

export default DataGrid;