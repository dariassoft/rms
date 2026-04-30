/**
 * Utility functions for detecting adjacent tables and calculating combined capacity
 */

// Distance threshold to consider tables as joined (in pixels)
const ADJACENCY_THRESHOLD = 5;

// Table dimensions by shape (in pixels)
const TABLE_DIMENSIONS = {
  square: { width: 64, height: 64 },
  round: { width: 64, height: 64 },
  rectangular: { width: 96, height: 64 },
};

/**
 * Get the bounding box of a table considering rotation
 */
const getTableBounds = (table) => {
  const dims = TABLE_DIMENSIONS[table.shape] || TABLE_DIMENSIONS.square;

  // For simplicity, we'll use axis-aligned bounding box
  // In a production app, you'd want to calculate rotated bounds properly
  return {
    left: table.posX,
    right: table.posX + dims.width,
    top: table.posY,
    bottom: table.posY + dims.height,
    centerX: table.posX + dims.width / 2,
    centerY: table.posY + dims.height / 2,
    width: dims.width,
    height: dims.height,
  };
};

/**
 * Check if two tables are adjacent (close enough to be considered joined)
 */
const areTablesAdjacent = (table1, table2) => {
  const bounds1 = getTableBounds(table1);
  const bounds2 = getTableBounds(table2);

  // Check if tables overlap or are very close
  const horizontalDistance = Math.min(
    Math.abs(bounds1.right - bounds2.left),
    Math.abs(bounds2.right - bounds1.left)
  );

  const verticalDistance = Math.min(
    Math.abs(bounds1.bottom - bounds2.top),
    Math.abs(bounds2.bottom - bounds1.top)
  );

  // Tables are adjacent if they're close on one axis and overlapping on the other
  const horizontallyAdjacent =
    horizontalDistance <= ADJACENCY_THRESHOLD &&
    !(bounds1.bottom < bounds2.top || bounds2.bottom < bounds1.top);

  const verticallyAdjacent =
    verticalDistance <= ADJACENCY_THRESHOLD &&
    !(bounds1.right < bounds2.left || bounds2.right < bounds1.left);

  return horizontallyAdjacent || verticallyAdjacent;
};

/**
 * Detect which side of table1 is adjacent to table2
 * Returns: 'top', 'bottom', 'left', 'right', or null
 */
const getAdjacentSide = (table1, table2) => {
  if (!areTablesAdjacent(table1, table2)) return null;

  const bounds1 = getTableBounds(table1);
  const bounds2 = getTableBounds(table2);

  const distances = {
    top: Math.abs(bounds1.top - bounds2.bottom),
    bottom: Math.abs(bounds1.bottom - bounds2.top),
    left: Math.abs(bounds1.left - bounds2.right),
    right: Math.abs(bounds1.right - bounds2.left),
  };

  // Find the minimum distance
  const minDistance = Math.min(...Object.values(distances));

  if (minDistance > ADJACENCY_THRESHOLD) return null;

  return Object.keys(distances).find(side => distances[side] === minDistance);
};

/**
 * Calculate the number of occupied sides for a table
 */
const calculateOccupiedSides = (table, allTables) => {
  const adjacentSides = new Set();

  allTables.forEach(otherTable => {
    if (otherTable.id === table.id) return;

    const side = getAdjacentSide(table, otherTable);
    if (side) {
      adjacentSides.add(side);
    }
  });

  return adjacentSides.size;
};

/**
 * Get all tables that are joined with a specific table
 */
const getJoinedTables = (table, allTables) => {
  return allTables.filter(otherTable => {
    if (otherTable.id === table.id) return false;
    return areTablesAdjacent(table, otherTable);
  });
};

/**
 * Calculate capacity reduction based on occupied sides
 * Logic:
 * - Each occupied side reduces capacity by a certain amount
 * - Square/Round tables: lose ~25% capacity per side (4 sides max)
 * - Rectangular tables: lose ~33% capacity per long side, ~20% per short side
 */
const calculateCapacityReduction = (table, occupiedSides, joinedTables) => {
  const baseCapacity = table.baseCapacity || table.capacity;

  if (occupiedSides === 0) {
    return baseCapacity;
  }

  let reductionPerSide;
  let maxSides;

  switch (table.shape) {
    case 'square':
      reductionPerSide = 0.25; // 25% per side
      maxSides = 4;
      break;
    case 'round':
      reductionPerSide = 0.2; // 20% per side (round tables are more flexible)
      maxSides = 4;
      break;
    case 'rectangular':
      reductionPerSide = 0.3; // 30% average
      maxSides = 4;
      break;
    default:
      reductionPerSide = 0.25;
      maxSides = 4;
  }

  const totalReduction = Math.min(occupiedSides * reductionPerSide, 0.8); // Max 80% reduction
  const adjustedCapacity = Math.ceil(baseCapacity * (1 - totalReduction));

  return Math.max(adjustedCapacity, 1); // Minimum 1 person
};

/**
 * Calculate total capacity for a group of joined tables
 */
const calculateGroupCapacity = (tableGroup) => {
  if (!tableGroup || tableGroup.length === 0) return 0;

  // Sum all individual adjusted capacities
  return tableGroup.reduce((total, table) => {
    return total + (table.capacity || 0);
  }, 0);
};

/**
 * Find all table groups (sets of joined tables)
 */
const findTableGroups = (allTables) => {
  const visited = new Set();
  const groups = [];

  const dfs = (table, currentGroup) => {
    if (visited.has(table.id)) return;

    visited.add(table.id);
    currentGroup.push(table);

    const joined = getJoinedTables(table, allTables);
    joined.forEach(joinedTable => {
      dfs(joinedTable, currentGroup);
    });
  };

  allTables.forEach(table => {
    if (!visited.has(table.id)) {
      const group = [];
      dfs(table, group);
      groups.push(group);
    }
  });

  return groups;
};

/**
 * Update all tables with joining information and adjusted capacity
 */
export const updateTablesWithJoining = (tables) => {
  return tables.map(table => {
    const occupiedSides = calculateOccupiedSides(table, tables);
    const joinedTables = getJoinedTables(table, tables);
    const joinedWith = joinedTables.map(t => t.id);

    // Ensure baseCapacity is set
    const baseCapacity = table.baseCapacity || table.capacity;

    // Calculate adjusted capacity
    const adjustedCapacity = calculateCapacityReduction(table, occupiedSides, joinedTables);

    return {
      ...table,
      baseCapacity,
      joinedWith,
      occupiedSides,
      capacity: adjustedCapacity,
    };
  });
};

/**
 * Get joining information for a specific table
 */
export const getTableJoiningInfo = (table, allTables) => {
  const joinedTables = getJoinedTables(table, allTables);
  const occupiedSides = calculateOccupiedSides(table, allTables);

  // Find the complete group this table belongs to
  const groups = findTableGroups(allTables);
  const tableGroup = groups.find(group => group.some(t => t.id === table.id));
  const groupCapacity = tableGroup ? calculateGroupCapacity(tableGroup) : table.capacity;

  return {
    isJoined: joinedTables.length > 0,
    joinedTableIds: joinedTables.map(t => t.id),
    joinedTableNumbers: joinedTables.map(t => t.number),
    occupiedSides,
    individualCapacity: table.capacity,
    groupCapacity,
    groupSize: tableGroup ? tableGroup.length : 1,
  };
};

/**
 * Check if two specific tables are adjacent
 */
export const checkTablesAdjacent = (table1, table2) => {
  return areTablesAdjacent(table1, table2);
};

/**
 * Get visual connection points between joined tables (for drawing lines)
 */
export const getConnectionPoints = (table1, table2) => {
  if (!areTablesAdjacent(table1, table2)) return null;

  const bounds1 = getTableBounds(table1);
  const bounds2 = getTableBounds(table2);

  const side = getAdjacentSide(table1, table2);

  let point1, point2;

  switch (side) {
    case 'top':
      point1 = { x: bounds1.centerX, y: bounds1.top };
      point2 = { x: bounds2.centerX, y: bounds2.bottom };
      break;
    case 'bottom':
      point1 = { x: bounds1.centerX, y: bounds1.bottom };
      point2 = { x: bounds2.centerX, y: bounds2.top };
      break;
    case 'left':
      point1 = { x: bounds1.left, y: bounds1.centerY };
      point2 = { x: bounds2.right, y: bounds2.centerY };
      break;
    case 'right':
      point1 = { x: bounds1.right, y: bounds1.centerY };
      point2 = { x: bounds2.left, y: bounds2.centerY };
      break;
    default:
      return null;
  }

  return { point1, point2, side };
};
