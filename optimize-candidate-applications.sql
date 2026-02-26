-- ============================================
-- Candidate Applications Table Optimization
-- ============================================
-- Run these queries to improve search performance on 111K+ records

-- 1. MOST IMPORTANT: Composite index for status filtering + date ordering
-- This will speed up your main query significantly
CREATE INDEX idx_applystatus_creation ON `candidate-applications` (applyStatusId, creationDate DESC);

-- 2. Index for candidateId lookups and joins
CREATE INDEX idx_candidateid ON `candidate-applications` (candidateId);

-- 3. Index for job category filtering
CREATE INDEX idx_professionid ON `candidate-applications` (professionId);

-- 4. Indexes for name and email searches
CREATE INDEX idx_firstname ON `candidate-applications` (firstName);
CREATE INDEX idx_lastname ON `candidate-applications` (lastName);
CREATE INDEX idx_email ON `candidate-applications` (email);

-- 5. Composite index for common filter combinations
CREATE INDEX idx_disabled_seen_status ON `candidate-applications` (disabled, seen, applyStatusId);

-- 6. Index for spontaneous application filtering
CREATE INDEX idx_spontaneous ON `candidate-applications` (spontaneousApplication);

-- 7. Update table statistics for query optimizer
ANALYZE TABLE `candidate-applications`;

-- ============================================
-- Verify indexes were created
-- ============================================
SHOW INDEX FROM `candidate-applications`;

-- ============================================
-- Test query performance (optional)
-- ============================================
-- Run EXPLAIN to see if indexes are being used
EXPLAIN SELECT * FROM `candidate-applications` 
WHERE applyStatusId = 'd5b37bf7-4dda-4e1d-bcb2-54e0782dda33' 
  AND disabled = 0
ORDER BY creationDate DESC 
LIMIT 20;
