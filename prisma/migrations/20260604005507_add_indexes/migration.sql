-- CreateIndex
CREATE INDEX "Article_published_publishedAt_idx" ON "Article"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "Article_published_categoryId_publishedAt_idx" ON "Article"("published", "categoryId", "publishedAt");

-- CreateIndex
CREATE INDEX "Article_categoryId_idx" ON "Article"("categoryId");

-- CreateIndex
CREATE INDEX "Category_type_sortOrder_idx" ON "Category"("type", "sortOrder");

-- CreateIndex
CREATE INDEX "ClickLog_targetId_targetType_idx" ON "ClickLog"("targetId", "targetType");

-- CreateIndex
CREATE INDEX "ClickLog_targetType_targetId_createdAt_idx" ON "ClickLog"("targetType", "targetId", "createdAt");

-- CreateIndex
CREATE INDEX "Exchange_status_sortOrder_clickCount_idx" ON "Exchange"("status", "sortOrder", "clickCount");

-- CreateIndex
CREATE INDEX "Exchange_status_categoryId_sortOrder_clickCount_idx" ON "Exchange"("status", "categoryId", "sortOrder", "clickCount");

-- CreateIndex
CREATE INDEX "Exchange_categoryId_idx" ON "Exchange"("categoryId");

-- CreateIndex
CREATE INDEX "FAQ_sortOrder_createdAt_idx" ON "FAQ"("sortOrder", "createdAt");

-- CreateIndex
CREATE INDEX "FAQ_published_idx" ON "FAQ"("published");
