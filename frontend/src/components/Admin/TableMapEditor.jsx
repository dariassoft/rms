import React, { useState, useEffect } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import DraggableTable from './DraggableTable';
import DraggableRoomElement from './DraggableRoomElement';
import api from '../../services/api';
import { updateTablesWithJoining, getTableJoiningInfo, getConnectionPoints } from '../../utils/tableJoining';

const TableMapEditor = ({ restaurantId }) => {
  const [tables, setTables] = useState([]);
  const [roomElements, setRoomElements] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('table'); // 'table' or item type
  const [mode, setMode] = useState('select'); // 'select', 'add-table', 'add-wall', 'add-window', 'add-door'

  useEffect(() => {
    fetchTables();
    fetchRoomElements();
  }, [restaurantId]);

  const fetchTables = async () => {
    try {
      const res = await api.get(`/restaurants/${restaurantId}/tables`);
      // Update tables with joining information on load
      const tablesWithJoining = updateTablesWithJoining(res.data);
      setTables(tablesWithJoining);
    } catch (err) {
      console.error('Error fetching tables', err);
    }
  };

  const fetchRoomElements = async () => {
    try {
      // TODO: Implementar endpoint para room elements
      // const res = await api.get(`/restaurants/${restaurantId}/room-elements`);
      // setRoomElements(res.data);
      setRoomElements([]);
    } catch (err) {
      console.error('Error fetching room elements', err);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, delta } = event;

    if (!delta) return;

    // Check if it's a table
    const tableIndex = tables.findIndex(t => t.id === active.id);
    if (tableIndex !== -1) {
      const updatedTables = tables.map((t) => {
        if (t.id === active.id) {
          const newPosX = Math.max(0, Math.min(t.posX + delta.x, 1500)); // Max canvas width - table width
          const newPosY = Math.max(0, Math.min(t.posY + delta.y, 650)); // Max canvas height - table height
          return {
            ...t,
            posX: newPosX,
            posY: newPosY,
          };
        }
        return t;
      });

      // Update tables with joining information
      const tablesWithJoining = updateTablesWithJoining(updatedTables);
      setTables(tablesWithJoining);

      // Update selected item if it's being dragged
      if (selectedItem?.id === active.id) {
        const updatedSelected = tablesWithJoining.find(t => t.id === active.id);
        setSelectedItem(updatedSelected);
      }
    } else {
      // It's a room element
      const elementIndex = roomElements.findIndex(e => e.id === active.id);
      if (elementIndex !== -1) {
        setRoomElements((prev) =>
          prev.map((e) => {
            if (e.id === active.id) {
              const newPosX = Math.max(0, Math.min(e.posX + delta.x, 1500));
              const newPosY = Math.max(0, Math.min(e.posY + delta.y, 650));
              return {
                ...e,
                posX: newPosX,
                posY: newPosY,
              };
            }
            return e;
          })
        );

        // Update selected item if it's being dragged
        if (selectedItem?.id === active.id) {
          const updatedElement = roomElements.find(e => e.id === active.id);
          if (updatedElement) {
            setSelectedItem({
              ...updatedElement,
              posX: Math.max(0, Math.min(updatedElement.posX + delta.x, 1500)),
              posY: Math.max(0, Math.min(updatedElement.posY + delta.y, 650)),
            });
          }
        }
      }
    }
  };

  const handleCanvasClick = (e) => {
    if (mode === 'select') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'add-table') {
      addTable(x, y);
    } else if (mode.startsWith('add-')) {
      const type = mode.replace('add-', '');
      addRoomElement(type, x, y);
    }

    setMode('select');
  };

  const addTable = (x = 50, y = 50) => {
    const newTable = {
      id: `temp-${Date.now()}`,
      number: (tables.length + 1).toString(),
      name: `Mesa ${tables.length + 1}`,
      description: '',
      capacity: 4,
      baseCapacity: 4,
      posX: x,
      posY: y,
      rotation: 0,
      shape: 'square',
      joinedWith: [],
      occupiedSides: 0,
    };
    const updatedTables = updateTablesWithJoining([...tables, newTable]);
    setTables(updatedTables);
    setSelectedItem({ ...newTable, type: 'table' });
    setSelectedType('table');
  };

  const addRoomElement = (type, x, y) => {
    const dimensions = {
      wall: { width: 200, height: 10 },
      window: { width: 80, height: 10 },
      door: { width: 60, height: 10 },
    };

    const newElement = {
      id: `temp-element-${Date.now()}`,
      type,
      posX: x,
      posY: y,
      ...dimensions[type],
      rotation: 0,
      color: type === 'wall' ? '#4B5563' : type === 'window' ? '#60A5FA' : '#F59E0B',
    };
    setRoomElements([...roomElements, newElement]);
    setSelectedItem({ ...newElement, type: 'element' });
    setSelectedType('element');
  };

  const deleteSelectedItem = () => {
    if (!selectedItem) return;

    if (selectedType === 'table') {
      setTables(tables.filter(t => t.id !== selectedItem.id));
    } else {
      setRoomElements(roomElements.filter(e => e.id !== selectedItem.id));
    }
    setSelectedItem(null);
  };

  const rotateSelectedItem = (degrees) => {
    if (!selectedItem) return;

    if (selectedType === 'table') {
      setTables(tables.map(t =>
        t.id === selectedItem.id
          ? { ...t, rotation: (t.rotation || 0) + degrees }
          : t
      ));
      setSelectedItem({ ...selectedItem, rotation: (selectedItem.rotation || 0) + degrees });
    } else {
      setRoomElements(roomElements.map(e =>
        e.id === selectedItem.id
          ? { ...e, rotation: (e.rotation || 0) + degrees }
          : e
      ));
      setSelectedItem({ ...selectedItem, rotation: (selectedItem.rotation || 0) + degrees });
    }
  };

  const updateTableProperties = (updates) => {
    if (!selectedItem || selectedType !== 'table') return;

    // If capacity is being updated, also update baseCapacity
    if ('capacity' in updates && !('baseCapacity' in updates)) {
      updates.baseCapacity = updates.capacity;
    }

    const updatedTables = tables.map(t =>
      t.id === selectedItem.id
        ? { ...t, ...updates }
        : t
    );

    // Recalculate joining info if shape or capacity changed
    if ('shape' in updates || 'capacity' in updates) {
      const tablesWithJoining = updateTablesWithJoining(updatedTables);
      setTables(tablesWithJoining);
      const updated = tablesWithJoining.find(t => t.id === selectedItem.id);
      setSelectedItem(updated);
    } else {
      setTables(updatedTables);
      setSelectedItem({ ...selectedItem, ...updates });
    }
  };

  const saveLayout = async () => {
    try {
      // Save tables
      await api.post(`/restaurants/${restaurantId}/tables`, tables);

      // TODO: Save room elements when endpoint is ready
      // await api.post(`/restaurants/${restaurantId}/room-elements`, roomElements);

      alert('Layout guardado correctamente');
    } catch (err) {
      console.error('Error saving layout', err);
      alert('Error al guardar el layout');
    }
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Sidebar - Tools */}
      <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Herramientas</h3>
          <div className="space-y-2">
            <button
              onClick={() => setMode('select')}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                mode === 'select'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✋ Seleccionar
            </button>
            <button
              onClick={() => setMode('add-table')}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                mode === 'add-table'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🪑 Añadir Mesa
            </button>
            <button
              onClick={() => setMode('add-wall')}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                mode === 'add-wall'
                  ? 'bg-gray-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🧱 Añadir Muro
            </button>
            <button
              onClick={() => setMode('add-window')}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                mode === 'add-window'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🪟 Añadir Ventana
            </button>
            <button
              onClick={() => setMode('add-door')}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                mode === 'add-door'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚪 Añadir Puerta
            </button>
          </div>
        </div>

        {mode !== 'select' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-medium">
              Haz clic en el canvas para colocar el elemento
            </p>
          </div>
        )}

        {/* Properties Panel */}
        {selectedItem && (
          <div className="flex-1 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Propiedades</h3>
              <button
                onClick={deleteSelectedItem}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
              >
                🗑️ Eliminar
              </button>
            </div>

            {selectedType === 'table' && (
              <div className="space-y-3">
                {/* Joining Info */}
                {selectedItem.joinedWith && selectedItem.joinedWith.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-800 font-semibold text-sm">🔗 Mesa Unida</span>
                    </div>
                    <div className="text-xs text-blue-700 space-y-1">
                      <div>Lados ocupados: {selectedItem.occupiedSides}</div>
                      <div>Capacidad base: {selectedItem.baseCapacity} personas</div>
                      <div>Capacidad ajustada: {selectedItem.capacity} personas</div>
                      <div className="text-[10px] text-blue-600 mt-1">
                        La capacidad se reduce según los lados unidos con otras mesas
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={selectedItem.number || ''}
                    onChange={(e) => updateTableProperties({ number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={selectedItem.name || ''}
                    onChange={(e) => updateTableProperties({ name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="ej: Terraza"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={selectedItem.description || ''}
                    onChange={(e) => updateTableProperties({ description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows="2"
                    placeholder="ej: Vista al jardín"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacidad Base
                  </label>
                  <input
                    type="number"
                    value={selectedItem.baseCapacity || selectedItem.capacity || 2}
                    onChange={(e) => updateTableProperties({ baseCapacity: parseInt(e.target.value), capacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Capacidad cuando está sola (se ajusta automáticamente al unirse)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forma
                  </label>
                  <select
                    value={selectedItem.shape || 'square'}
                    onChange={(e) => updateTableProperties({ shape: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="square">Cuadrada</option>
                    <option value="round">Redonda</option>
                    <option value="rectangular">Rectangular</option>
                  </select>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotación
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => rotateSelectedItem(-15)}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  ↺ -15°
                </button>
                <button
                  onClick={() => rotateSelectedItem(15)}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  ↻ +15°
                </button>
              </div>
              <div className="mt-2 text-center text-sm text-gray-600">
                {(selectedItem.rotation || 0).toFixed(0)}°
              </div>
            </div>
          </div>
        )}

        <button
          onClick={saveLayout}
          className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105"
        >
          💾 Guardar Layout
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <div
          onClick={handleCanvasClick}
          className={`relative w-full h-[700px] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden ${
            mode !== 'select' ? 'cursor-crosshair' : 'cursor-default'
          }`}
          style={{ backgroundColor: '#f9fafb' }}
        >
          {/* Grid Helper - Bottom Layer */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', zIndex: 0 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            {/* Room Elements */}
            {roomElements.map((element) => (
              <DraggableRoomElement
                key={element.id}
                element={element}
                isSelected={selectedItem?.id === element.id}
                onSelect={() => {
                  setSelectedItem(element);
                  setSelectedType('element');
                }}
              />
            ))}

            {/* Tables */}
            {tables.map((table) => (
              <DraggableTable
                key={table.id}
                table={table}
                isSelected={selectedItem?.id === table.id}
                onSelect={() => {
                  setSelectedItem(table);
                  setSelectedType('table');
                }}
              />
            ))}
          </DndContext>

          {/* Connection Lines - Top Layer */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', zIndex: 100 }}>
            {tables.map((table) => {
              if (!table.joinedWith || table.joinedWith.length === 0) return null;

              return table.joinedWith.map((joinedId) => {
                const otherTable = tables.find(t => t.id === joinedId);
                if (!otherTable) return null;

                // Avoid drawing the same line twice
                if (table.id > joinedId) return null;

                const connection = getConnectionPoints(table, otherTable);
                if (!connection) return null;

                const { point1, point2 } = connection;

                return (
                  <g key={`${table.id}-${joinedId}`}>
                    {/* Connection line */}
                    <line
                      x1={point1.x}
                      y1={point1.y}
                      x2={point2.x}
                      y2={point2.y}
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray="5,3"
                      opacity="0.6"
                    />
                    {/* Connection dots */}
                    <circle cx={point1.x} cy={point1.y} r="4" fill="#3B82F6" opacity="0.8" />
                    <circle cx={point2.x} cy={point2.y} r="4" fill="#3B82F6" opacity="0.8" />
                  </g>
                );
              });
            })}
          </svg>
        </div>

        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Mesas: {tables.length}</span>
            <span>Elementos: {roomElements.length}</span>
            <span className="text-gray-400">
              Arrastra los elementos para posicionarlos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableMapEditor;
