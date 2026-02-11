import React, { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

// Función para formatear fechas a dd-mm-yyyy
const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha + 'T00:00:00');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Función para obtener la fecha local en formato YYYY-MM-DD
const obtenerFechaLocal = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ComprasPadre = ({ productos, onCompraRegistrada }) => {
  const [comprasPadre, setComprasPadre] = useState([]);
  const [expandedCompra, setExpandedCompra] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [compraForm, setCompraForm] = useState({
    fecha: obtenerFechaLocal(),
    proveedor: '',
    notas: '',
    compras_data: []
  });

  const [itemForm, setItemForm] = useState({
    producto: '',
    cantidad: '',
    costo_unitario: '',
    valor_venta: ''
  });

  // Cargar compras padre
  const loadComprasPadre = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/compras-padre/`);
      const data = await response.json();
      setComprasPadre(data.results ?? data ?? []);
    } catch (error) {
      console.error('Error al cargar compras padre:', error);
    }
  }, []);

  useEffect(() => {
    loadComprasPadre();
  }, [loadComprasPadre]);

  const handleAddItem = useCallback(() => {
    if (itemForm.producto && itemForm.cantidad && itemForm.costo_unitario && itemForm.valor_venta) {
      const nuevoItem = {
        producto: parseInt(itemForm.producto),
        cantidad: parseInt(itemForm.cantidad),
        costo_unitario: parseInt(itemForm.costo_unitario),
        valor_venta: parseInt(itemForm.valor_venta),
        fecha: compraForm.fecha,
        proveedor: compraForm.proveedor
      };
      
      setCompraForm({
        ...compraForm,
        compras_data: [...compraForm.compras_data, nuevoItem]
      });
      
      setItemForm({
        producto: '',
        cantidad: '',
        costo_unitario: '',
        valor_venta: ''
      });
    } else {
      alert('Por favor completa todos los campos del item');
    }
  }, [itemForm, compraForm]);

  const handleRemoveItem = useCallback((index) => {
    setCompraForm({
      ...compraForm,
      compras_data: compraForm.compras_data.filter((_, i) => i !== index)
    });
  }, [compraForm]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (compraForm.compras_data.length === 0) {
      alert('Debes agregar al menos un producto a la compra');
      return;
    }

    setLoading(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/api/compras-padre/${editingId}/` : `${API_URL}/api/compras-padre/`;
      
      console.log('Enviando datos:', compraForm);
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraForm)
      });

      if (response.ok) {
        alert(editingId ? 'Compra actualizada exitosamente' : 'Compra registrada exitosamente');
        resetForm();
        loadComprasPadre();
        if (onCompraRegistrada) onCompraRegistrada();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert('Error al registrar/actualizar compra: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar/actualizar compra: ' + error.message);
    }
    setLoading(false);
  }, [compraForm, editingId]);

  const resetForm = () => {
    setCompraForm({
      fecha: obtenerFechaLocal(),
      proveedor: '',
      notas: '',
      compras_data: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (compra) => {
    setEditingId(compra.id);
    setCompraForm({
      fecha: compra.fecha,
      proveedor: compra.proveedor,
      notas: compra.notas,
      compras_data: compra.compras.map(c => ({
        producto: c.producto,
        cantidad: c.cantidad,
        costo_unitario: c.costo_unitario,
        valor_venta: c.valor_venta,
        fecha: c.fecha,
        proveedor: c.proveedor
      }))
    });
    setShowForm(true);
  };

  const handleDelete = useCallback(async (compraId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta compra?')) {
      try {
        await fetch(`${API_URL}/api/compras-padre/${compraId}/`, {
          method: 'DELETE'
        });
        alert('Compra eliminada exitosamente');
        loadComprasPadre();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar compra');
      }
    }
  }, [loadComprasPadre]);

  const getProductoNombre = (productId) => {
    const producto = productos.find(p => p.id === productId);
    return producto ? producto.nombre : 'Producto desconocido';
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold"></h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm md:text-base"
        >
          {showForm ? 'Cancelar' : 'Agregar Nueva Compra'}
        </button>
      </div>

      {/* Formulario para crear/editar compra padre */}
      {showForm && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-2 border-blue-300">
          <h3 className="text-lg md:text-xl font-bold mb-4">
            {editingId ? 'Editar Compra' : 'Nueva Compra Padre'}
          </h3>

          <form className="space-y-4">
            {/* Datos generales de la compra */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1">Fecha *</label>
                <input
                  type="date"
                  value={compraForm.fecha}
                  onChange={(e) => setCompraForm({...compraForm, fecha: e.target.value})}
                  className="w-full border rounded px-3 py-2 text-xs md:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-1">Proveedor *</label>
                <input
                  type="text"
                  value={compraForm.proveedor}
                  onChange={(e) => setCompraForm({...compraForm, proveedor: e.target.value})}
                  placeholder="Nombre del proveedor"
                  className="w-full border rounded px-3 py-2 text-xs md:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-xs md:text-sm font-medium mb-1">Notas</label>
                <input
                  type="text"
                  value={compraForm.notas}
                  onChange={(e) => setCompraForm({...compraForm, notas: e.target.value})}
                  placeholder="Notas adicionales"
                  className="w-full border rounded px-3 py-2 text-xs md:text-sm"
                />
              </div>
            </div>

            {/* Agregar items */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <h4 className="font-bold mb-4 text-sm md:text-base">Agregar Productos a la Compra</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 mb-3">
                <div className="sm:col-span-2 md:col-span-1">
                  <label className="block text-xs md:text-sm font-medium mb-1">Producto *</label>
                  <select
                    value={itemForm.producto}
                    onChange={(e) => setItemForm({...itemForm, producto: e.target.value})}
                    className="w-full border rounded px-3 py-2 text-xs md:text-sm"
                    required
                  >
                    <option value="">Seleccionar</option>
                    {productos.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1">Cantidad *</label>
                  <input
                    type="number"
                    value={itemForm.cantidad}
                    onChange={(e) => setItemForm({...itemForm, cantidad: e.target.value})}
                    placeholder="Qty"
                    className="w-full border rounded px-3 py-2 text-xs md:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1">Costo Unit. *</label>
                  <input
                    type="number"
                    value={itemForm.costo_unitario}
                    onChange={(e) => setItemForm({...itemForm, costo_unitario: e.target.value})}
                    placeholder="Costo"
                    className="w-full border rounded px-3 py-2 text-xs md:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1">Valor Venta *</label>
                  <input
                    type="number"
                    value={itemForm.valor_venta}
                    onChange={(e) => setItemForm({...itemForm, valor_venta: e.target.value})}
                    placeholder="V. Venta"
                    className="w-full border rounded px-3 py-2 text-xs md:text-sm"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition text-xs md:text-sm font-medium whitespace-nowrap"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Lista de items agregados */}
              {compraForm.compras_data.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-semibold mb-2 text-xs md:text-sm">Items en esta compra:</h5>
                  <div className="space-y-2">
                    {compraForm.compras_data.map((item, index) => (
                      <div
                        key={`item-${index}-${item.producto}-${Date.now()}`}
                        className="flex justify-between items-center bg-white p-3 rounded border text-xs md:text-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-xs md:text-sm">
                            {getProductoNombre(item.producto)} x {item.cantidad}
                          </p>
                          <p className="text-xs text-gray-600">
                            Costo: ${item.costo_unitario} | Venta: ${item.valor_venta}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="bg-red-600 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm hover:bg-red-700 transition whitespace-nowrap ml-2"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 flex-wrap">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || compraForm.compras_data.length === 0}
                className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition text-xs md:text-sm whitespace-nowrap"
              >
                {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Guardar Compra'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de compras padre */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Compras Registradas</h3>
        {comprasPadre.length === 0 ? (
          <p className="text-gray-500">No hay compras registradas aún</p>
        ) : (
          comprasPadre.map(compra => (
            <div key={compra.id} className="bg-white rounded-lg shadow-md border-l-4 border-blue-500">
              <div
                className="p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedCompra(expandedCompra === compra.id ? null : compra.id)}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base md:text-lg font-bold truncate">
                      Compra #{compra.numero} - {compra.proveedor}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600 break-words">
                      Fecha: {formatearFecha(compra.fecha)} |
                      Productos: {compra.cantidad_productos}
                    </p>
                    <p className="text-base md:text-lg font-bold text-gray-600 mt-2">
                      Gasto Total: ${compra.costo_total}
                    </p>
                    {compra.notas && (
                      <p className="text-xs md:text-sm text-gray-500 mt-1 break-words">Notas: {compra.notas}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(compra);
                      }}
                      className="bg-yellow-500 text-white px-2 md:px-3 py-2 rounded hover:bg-yellow-600 transition text-xs md:text-sm whitespace-nowrap"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(compra.id);
                      }}
                      className="bg-red-600 text-white px-2 md:px-3 py-2 rounded hover:bg-red-700 transition text-xs md:text-sm whitespace-nowrap"
                      title="Eliminar compra"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>

              {/* Detalles expandibles */}
              {expandedCompra === compra.id && (
                <div className="bg-gray-50 p-3 md:p-4 border-t">
                  <h5 className="font-bold mb-3 text-sm md:text-base">Productos en esta compra:</h5>
                  <div className="overflow-x-auto -mx-3 md:mx-0">
                    <table className="w-full text-xs md:text-sm min-w-max md:min-w-0">
                      <thead>
                        <tr className="border-b bg-gray-100">
                          <th className="text-left p-2 md:p-3">Producto</th>
                          <th className="text-right p-2 md:p-3">Cant.</th>
                          <th className="text-right p-2 md:p-3 hidden sm:table-cell">Costo Unit.</th>
                          <th className="text-right p-2 md:p-3">Total</th>
                          <th className="text-right p-2 md:p-3 hidden md:table-cell">V. Venta</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compra.compras.map((item, index) => (
                          <tr key={`compra-item-${item.id}`} className="border-b hover:bg-white">
                            <td className="p-2 md:p-3">{item.producto_nombre}</td>
                            <td className="text-right p-2 md:p-3">{item.cantidad}</td>
                            <td className="text-right p-2 md:p-3 hidden sm:table-cell">${item.costo_unitario}</td>
                            <td className="text-right p-2 md:p-3 font-semibold">${item.costo_total}</td>
                            <td className="text-right p-2 md:p-3 hidden md:table-cell">${item.valor_venta}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComprasPadre;
