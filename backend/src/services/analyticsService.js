import Order from '../models/Order.js'
import Customer from '../models/Customer.js'
import Product from '../models/Product.js'
import Review from '../models/Review.js'

// Get sales metrics for dashboard
const getSalesMetrics = async (startDate, endDate) => {
  try {
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const pendingOrders = orders.filter((o) => o.status === 'pending').length
    const confirmedOrders = orders.filter((o) => o.status === 'confirmed').length
    const shippedOrders = orders.filter((o) => o.status === 'shipped').length
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length
    const completedOrders = orders.filter((o) => o.status === 'completed').length
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      completedOrders,
      cancelledOrders,
      conversionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
    }
  } catch (error) {
    console.error('Error calculating sales metrics:', error)
    throw error
  }
}

// Get customer metrics
const getCustomerMetrics = async (startDate, endDate) => {
  try {
    const newCustomers = await Customer.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    })

    const totalCustomers = await Customer.countDocuments()

    const returningCustomers = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$customerId' } },
      { $count: 'count' },
    ])

    const returningCount = returningCustomers[0]?.count || 0
    const growthRate = totalCustomers > 0 ? (newCustomers / totalCustomers) * 100 : 0

    return {
      totalCustomers,
      newCustomers,
      returningCustomers: returningCount,
      growthRate,
      avgCustomerLifetimeValue: 0,
    }
  } catch (error) {
    console.error('Error calculating customer metrics:', error)
    throw error
  }
}

// Get product performance metrics
const getProductMetrics = async () => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
    ])

    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).select('name sku stock')

    const totalProducts = await Product.countDocuments()

    return {
      topProducts,
      lowStockProducts,
      totalProducts,
    }
  } catch (error) {
    console.error('Error calculating product metrics:', error)
    throw error
  }
}

// Get review metrics
const getReviewMetrics = async () => {
  try {
    const totalReviews = await Review.countDocuments()
    const approvedReviews = await Review.countDocuments({ status: 'approved' })
    const pendingReviews = await Review.countDocuments({ status: 'pending' })

    const averageRating = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ])

    const ratingDistribution = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$rating', count: { $count: {} } } },
      { $sort: { _id: 1 } },
    ])

    return {
      totalReviews,
      approvedReviews,
      pendingReviews,
      averageRating: averageRating[0]?.avgRating || 0,
      ratingDistribution,
    }
  } catch (error) {
    console.error('Error calculating review metrics:', error)
    throw error
  }
}

// Get daily sales trend
const getDailySalesTrend = async (days = 7) => {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orders: { $count: {} },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    return dailySales
  } catch (error) {
    console.error('Error calculating daily sales trend:', error)
    throw error
  }
}

// Get monthly sales trend
const getMonthlySalesTrend = async (months = 6) => {
  try {
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orders: { $count: {} },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    return monthlySales
  } catch (error) {
    console.error('Error calculating monthly sales trend:', error)
    throw error
  }
}

// Get comprehensive dashboard data
const getDashboardMetrics = async () => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const [monthlySales, yearlySales, customerMetrics, productMetrics, reviewMetrics, dailyTrend, monthlyTrend] =
      await Promise.all([
        getSalesMetrics(startOfMonth, now),
        getSalesMetrics(startOfYear, now),
        getCustomerMetrics(startOfMonth, now),
        getProductMetrics(),
        getReviewMetrics(),
        getDailySalesTrend(7),
        getMonthlySalesTrend(6),
      ])

    return {
      monthly: monthlySales,
      yearly: yearlySales,
      customers: customerMetrics,
      products: productMetrics,
      reviews: reviewMetrics,
      dailyTrend,
      monthlyTrend,
      lastUpdated: now,
    }
  } catch (error) {
    console.error('Error getting dashboard metrics:', error)
    throw error
  }
}

// Get order status breakdown for pie/donut chart
const getOrderStatusBreakdown = async () => {
  try {
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { count: -1 } },
    ])

    return statusCounts
  } catch (error) {
    console.error('Error calculating order status breakdown:', error)
    throw error
  }
}

// Get category performance
const getCategoryPerformance = async () => {
  try {
    const categoryStats = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.categoryId',
          totalSales: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $count: {} },
        },
      },
      { $sort: { revenue: -1 } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
    ])

    return categoryStats
  } catch (error) {
    console.error('Error getting category performance:', error)
    throw error
  }
}

export default {
  getSalesMetrics,
  getCustomerMetrics,
  getProductMetrics,
  getReviewMetrics,
  getDailySalesTrend,
  getMonthlySalesTrend,
  getDashboardMetrics,
  getCategoryPerformance,
  getOrderStatusBreakdown,
}
