import express from 'express'
import analyticsService from '../services/analyticsService.js'
import { verifyToken, verifyAdmin } from '../middlewares/auth.js'

const router = express.Router()

// Get comprehensive dashboard metrics (admin only)
router.get('/dashboard', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const metrics = await analyticsService.getDashboardMetrics()

    res.json({
      success: true,
      message: 'Dashboard metrics retrieved',
      data: metrics,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard metrics',
      error: error.message,
    })
  }
})

// Get sales metrics for date range
router.get('/sales', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate query parameters are required',
      })
    }

    const metrics = await analyticsService.getSalesMetrics(
      new Date(startDate),
      new Date(endDate)
    )

    res.json({
      success: true,
      message: 'Sales metrics retrieved',
      data: metrics,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sales metrics',
      error: error.message,
    })
  }
})

// Get customer metrics for date range
router.get('/customers', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate query parameters are required',
      })
    }

    const metrics = await analyticsService.getCustomerMetrics(
      new Date(startDate),
      new Date(endDate)
    )

    res.json({
      success: true,
      message: 'Customer metrics retrieved',
      data: metrics,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer metrics',
      error: error.message,
    })
  }
})

// Get product performance metrics
router.get('/products', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const metrics = await analyticsService.getProductMetrics()

    res.json({
      success: true,
      message: 'Product metrics retrieved',
      data: metrics,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product metrics',
      error: error.message,
    })
  }
})

// Get review analytics
router.get('/reviews', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const metrics = await analyticsService.getReviewMetrics()

    res.json({
      success: true,
      message: 'Review metrics retrieved',
      data: metrics,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve review metrics',
      error: error.message,
    })
  }
})

// Get daily sales trend
router.get('/sales/daily', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { days = 7 } = req.query

    const trend = await analyticsService.getDailySalesTrend(parseInt(days))

    res.json({
      success: true,
      message: 'Daily sales trend retrieved',
      data: trend,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve daily sales trend',
      error: error.message,
    })
  }
})

// Get monthly sales trend
router.get('/sales/monthly', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { months = 6 } = req.query

    const trend = await analyticsService.getMonthlySalesTrend(parseInt(months))

    res.json({
      success: true,
      message: 'Monthly sales trend retrieved',
      data: trend,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve monthly sales trend',
      error: error.message,
    })
  }
})

// Get category performance
router.get('/categories', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const stats = await analyticsService.getCategoryPerformance()

    res.json({
      success: true,
      message: 'Category performance retrieved',
      data: stats,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve category performance',
      error: error.message,
    })
  }
})

export default router
