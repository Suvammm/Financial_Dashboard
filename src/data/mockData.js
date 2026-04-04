// src/data/mockData.js
// Static mock data — no backend required

/** @type {Array<Transaction>} */
export const MOCK_TRANSACTIONS = [
  // ── January ─────────────────────────────────────────────
  { id: 't001', date: '2024-01-03', description: 'Monthly Salary',       amount: 5800,  category: 'Salary',        type: 'income'  },
  { id: 't002', date: '2024-01-05', description: 'Grocery Store',        amount: 142,   category: 'Food',          type: 'expense' },
  { id: 't003', date: '2024-01-07', description: 'Netflix Subscription', amount: 15,    category: 'Entertainment', type: 'expense' },
  { id: 't004', date: '2024-01-09', description: 'Electric Bill',        amount: 94,    category: 'Utilities',     type: 'expense' },
  { id: 't005', date: '2024-01-12', description: 'Freelance Project',    amount: 1200,  category: 'Freelance',     type: 'income'  },
  { id: 't006', date: '2024-01-14', description: 'Restaurant Dinner',    amount: 67,    category: 'Food',          type: 'expense' },
  { id: 't007', date: '2024-01-16', description: 'Gym Membership',       amount: 45,    category: 'Health',        type: 'expense' },
  { id: 't008', date: '2024-01-19', description: 'Spotify Premium',      amount: 10,    category: 'Entertainment', type: 'expense' },
  { id: 't009', date: '2024-01-22', description: 'Uber Ride',            amount: 22,    category: 'Transport',     type: 'expense' },
  { id: 't010', date: '2024-01-25', description: 'Internet Bill',        amount: 60,    category: 'Utilities',     type: 'expense' },
  { id: 't011', date: '2024-01-28', description: 'Online Course',        amount: 49,    category: 'Education',     type: 'expense' },
  { id: 't012', date: '2024-01-30', description: 'Dividend Income',      amount: 320,   category: 'Investment',    type: 'income'  },

  // ── February ─────────────────────────────────────────────
  { id: 't013', date: '2024-02-02', description: 'Monthly Salary',       amount: 5800,  category: 'Salary',        type: 'income'  },
  { id: 't014', date: '2024-02-05', description: 'Grocery Store',        amount: 158,   category: 'Food',          type: 'expense' },
  { id: 't015', date: '2024-02-08', description: 'Doctor Visit',         amount: 120,   category: 'Health',        type: 'expense' },
  { id: 't016', date: '2024-02-10', description: 'Movie Tickets',        amount: 38,    category: 'Entertainment', type: 'expense' },
  { id: 't017', date: '2024-02-13', description: 'Valentine Dinner',     amount: 145,   category: 'Food',          type: 'expense' },
  { id: 't018', date: '2024-02-15', description: 'Freelance Project',    amount: 800,   category: 'Freelance',     type: 'income'  },
  { id: 't019', date: '2024-02-18', description: 'Bus Pass',             amount: 35,    category: 'Transport',     type: 'expense' },
  { id: 't020', date: '2024-02-20', description: 'Electric Bill',        amount: 88,    category: 'Utilities',     type: 'expense' },
  { id: 't021', date: '2024-02-22', description: 'Amazon Purchase',      amount: 79,    category: 'Shopping',      type: 'expense' },
  { id: 't022', date: '2024-02-26', description: 'Dividend Income',      amount: 320,   category: 'Investment',    type: 'income'  },
  { id: 't023', date: '2024-02-28', description: 'Coffee Shop',          amount: 28,    category: 'Food',          type: 'expense' },

  // ── March ─────────────────────────────────────────────
  { id: 't024', date: '2024-03-01', description: 'Monthly Salary',       amount: 5800,  category: 'Salary',        type: 'income'  },
  { id: 't025', date: '2024-03-04', description: 'Grocery Store',        amount: 167,   category: 'Food',          type: 'expense' },
  { id: 't026', date: '2024-03-07', description: 'Netflix Subscription', amount: 15,    category: 'Entertainment', type: 'expense' },
  { id: 't027', date: '2024-03-09', description: 'Phone Bill',           amount: 75,    category: 'Utilities',     type: 'expense' },
  { id: 't028', date: '2024-03-11', description: 'Gym Membership',       amount: 45,    category: 'Health',        type: 'expense' },
  { id: 't029', date: '2024-03-14', description: 'Freelance Project',    amount: 2100,  category: 'Freelance',     type: 'income'  },
  { id: 't030', date: '2024-03-16', description: 'Restaurant Lunch',     amount: 42,    category: 'Food',          type: 'expense' },
  { id: 't031', date: '2024-03-19', description: 'New Shoes',            amount: 110,   category: 'Shopping',      type: 'expense' },
  { id: 't032', date: '2024-03-22', description: 'Flight Tickets',       amount: 380,   category: 'Travel',        type: 'expense' },
  { id: 't033', date: '2024-03-25', description: 'Electric Bill',        amount: 91,    category: 'Utilities',     type: 'expense' },
  { id: 't034', date: '2024-03-28', description: 'Dividend Income',      amount: 320,   category: 'Investment',    type: 'income'  },
  { id: 't035', date: '2024-03-30', description: 'Book Purchase',        amount: 34,    category: 'Education',     type: 'expense' },

  // ── April ─────────────────────────────────────────────
  { id: 't036', date: '2024-04-02', description: 'Monthly Salary',       amount: 5800,  category: 'Salary',        type: 'income'  },
  { id: 't037', date: '2024-04-04', description: 'Grocery Store',        amount: 131,   category: 'Food',          type: 'expense' },
  { id: 't038', date: '2024-04-07', description: 'Hotel Stay',           amount: 220,   category: 'Travel',        type: 'expense' },
  { id: 't039', date: '2024-04-09', description: 'Freelance Project',    amount: 950,   category: 'Freelance',     type: 'income'  },
  { id: 't040', date: '2024-04-12', description: 'Concert Tickets',      amount: 95,    category: 'Entertainment', type: 'expense' },
  { id: 't041', date: '2024-04-15', description: 'Pharmacy',             amount: 48,    category: 'Health',        type: 'expense' },
  { id: 't042', date: '2024-04-18', description: 'Gas Station',          amount: 58,    category: 'Transport',     type: 'expense' },
  { id: 't043', date: '2024-04-21', description: 'Internet Bill',        amount: 60,    category: 'Utilities',     type: 'expense' },
  { id: 't044', date: '2024-04-24', description: 'Dividend Income',      amount: 320,   category: 'Investment',    type: 'income'  },
  { id: 't045', date: '2024-04-27', description: 'Clothing Store',       amount: 175,   category: 'Shopping',      type: 'expense' },

  // ── May ─────────────────────────────────────────────
  { id: 't046', date: '2024-05-01', description: 'Monthly Salary',       amount: 6200,  category: 'Salary',        type: 'income'  },
  { id: 't047', date: '2024-05-03', description: 'Grocery Store',        amount: 148,   category: 'Food',          type: 'expense' },
  { id: 't048', date: '2024-05-06', description: 'Netflix Subscription', amount: 15,    category: 'Entertainment', type: 'expense' },
  { id: 't049', date: '2024-05-09', description: 'Electric Bill',        amount: 82,    category: 'Utilities',     type: 'expense' },
  { id: 't050', date: '2024-05-11', description: 'Freelance Project',    amount: 1600,  category: 'Freelance',     type: 'income'  },
  { id: 't051', date: '2024-05-14', description: 'Gym Membership',       amount: 45,    category: 'Health',        type: 'expense' },
  { id: 't052', date: '2024-05-17', description: 'Restaurant Dinner',    amount: 89,    category: 'Food',          type: 'expense' },
  { id: 't053', date: '2024-05-20', description: 'Online Course',        amount: 129,   category: 'Education',     type: 'expense' },
  { id: 't054', date: '2024-05-23', description: 'Uber Ride',            amount: 31,    category: 'Transport',     type: 'expense' },
  { id: 't055', date: '2024-05-26', description: 'Dividend Income',      amount: 320,   category: 'Investment',    type: 'income'  },
  { id: 't056', date: '2024-05-29', description: 'Amazon Purchase',      amount: 63,    category: 'Shopping',      type: 'expense' },

  // ── June ─────────────────────────────────────────────
  { id: 't057', date: '2024-06-03', description: 'Monthly Salary',       amount: 6200,  category: 'Salary',        type: 'income'  },
  { id: 't058', date: '2024-06-05', description: 'Grocery Store',        amount: 172,   category: 'Food',          type: 'expense' },
  { id: 't059', date: '2024-06-08', description: 'Vacation Flight',      amount: 540,   category: 'Travel',        type: 'expense' },
  { id: 't060', date: '2024-06-10', description: 'Vacation Hotel',       amount: 680,   category: 'Travel',        type: 'expense' },
  { id: 't061', date: '2024-06-13', description: 'Freelance Project',    amount: 1400,  category: 'Freelance',     type: 'income'  },
  { id: 't062', date: '2024-06-16', description: 'Phone Bill',           amount: 75,    category: 'Utilities',     type: 'expense' },
  { id: 't063', date: '2024-06-19', description: 'Gym Membership',       amount: 45,    category: 'Health',        type: 'expense' },
  { id: 't064', date: '2024-06-22', description: 'Cinema',               amount: 24,    category: 'Entertainment', type: 'expense' },
  { id: 't065', date: '2024-06-25', description: 'Dividend Income',      amount: 320,   category: 'Investment',    type: 'income'  },
  { id: 't066', date: '2024-06-28', description: 'Clothing Store',       amount: 210,   category: 'Shopping',      type: 'expense' },
];

/** Month labels for charts */
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

/** Category color mapping */
export const CATEGORY_COLORS = {
  Food:          '#f59e0b',
  Utilities:     '#6366f1',
  Entertainment: '#ec4899',
  Health:        '#10b981',
  Transport:     '#3b82f6',
  Shopping:      '#8b5cf6',
  Education:     '#14b8a6',
  Travel:        '#f97316',
  Salary:        '#10b981',
  Freelance:     '#34d399',
  Investment:    '#fbbf24',
};

/** All unique categories */
export const ALL_CATEGORIES = [
  'All',
  ...Object.keys(CATEGORY_COLORS),
];
