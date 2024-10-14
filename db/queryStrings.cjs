const tableExists = `
SELECT EXISTS (
      SELECT 1                                     
      FROM pg_catalog.pg_tables 
      WHERE schemaname='public' 
      AND tablename=$1
);
`;

const dtypeExists = `
SELECT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = $1 AND typtype = 'e'
);
`;

module.exports = {
  tableExists,
  dtypeExists,
};
