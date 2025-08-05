class AnalyticsService {
  async logEvent(supabase, eventData) {
    try {
      const {
        userId,
        conversationId,
        sessionId,
        eventType,
        eventData: data,
        ipAddress,
        userAgent
      } = eventData;

      const { error } = await supabase
        .from('chat_analytics')
        .insert({
          user_id: userId,
          conversation_id: conversationId,
          session_id: sessionId,
          event_type: eventType,
          event_data: data,
          ip_address: ipAddress,
          user_agent: userAgent,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Analytics logging error:', error);
      }
    } catch (error) {
      console.error('Analytics service error:', error);
    }
  }

  async getConversationMetrics(supabase, conversationId) {
    try {
      const { data: analytics, error } = await supabase
        .from('chat_analytics')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching conversation metrics:', error);
        return null;
      }

      return this.processConversationMetrics(analytics);
    } catch (error) {
      console.error('Conversation metrics error:', error);
      return null;
    }
  }

  async getUserMetrics(supabase, userId, timeframe = '30d') {
    try {
      const startDate = this.getStartDate(timeframe);
      
      const { data: analytics, error } = await supabase
        .from('chat_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching user metrics:', error);
        return null;
      }

      return this.processUserMetrics(analytics);
    } catch (error) {
      console.error('User metrics error:', error);
      return null;
    }
  }

  async getSystemMetrics(supabase, timeframe = '7d') {
    try {
      const startDate = this.getStartDate(timeframe);
      
      const { data: analytics, error } = await supabase
        .from('chat_analytics')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching system metrics:', error);
        return null;
      }

      return this.processSystemMetrics(analytics);
    } catch (error) {
      console.error('System metrics error:', error);
      return null;
    }
  }

  processConversationMetrics(analytics) {
    const metrics = {
      totalEvents: analytics.length,
      messagesSent: 0,
      responsesReceived: 0,
      errors: 0,
      averageResponseTime: 0,
      conversationDuration: 0,
      categories: {},
      confidenceScores: []
    };

    let responseTimes = [];
    let startTime = null;
    let endTime = null;

    analytics.forEach(event => {
      const eventTime = new Date(event.created_at);
      
      if (!startTime || eventTime < startTime) startTime = eventTime;
      if (!endTime || eventTime > endTime) endTime = eventTime;

      switch (event.event_type) {
        case 'message_sent':
          metrics.messagesSent++;
          break;
        case 'response_received':
          metrics.responsesReceived++;
          if (event.event_data?.responseTime) {
            responseTimes.push(event.event_data.responseTime);
          }
          if (event.event_data?.category) {
            metrics.categories[event.event_data.category] = 
              (metrics.categories[event.event_data.category] || 0) + 1;
          }
          if (event.event_data?.confidence) {
            metrics.confidenceScores.push(event.event_data.confidence);
          }
          break;
        case 'error':
          metrics.errors++;
          break;
      }
    });

    if (responseTimes.length > 0) {
      metrics.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    }

    if (startTime && endTime) {
      metrics.conversationDuration = endTime - startTime;
    }

    if (metrics.confidenceScores.length > 0) {
      metrics.averageConfidence = metrics.confidenceScores.reduce((a, b) => a + b, 0) / metrics.confidenceScores.length;
    }

    return metrics;
  }

  processUserMetrics(analytics) {
    const metrics = {
      totalSessions: new Set(),
      totalConversations: new Set(),
      totalMessages: 0,
      totalResponses: 0,
      totalErrors: 0,
      averageResponseTime: 0,
      mostActiveHours: {},
      categoryBreakdown: {},
      averageConfidence: 0,
      engagementScore: 0
    };

    let responseTimes = [];
    let confidenceScores = [];
    let dailyActivity = {};

    analytics.forEach(event => {
      const eventDate = new Date(event.created_at);
      const hour = eventDate.getHours();
      const day = eventDate.toDateString();

      if (event.session_id) metrics.totalSessions.add(event.session_id);
      if (event.conversation_id) metrics.totalConversations.add(event.conversation_id);

      metrics.mostActiveHours[hour] = (metrics.mostActiveHours[hour] || 0) + 1;
      dailyActivity[day] = (dailyActivity[day] || 0) + 1;

      switch (event.event_type) {
        case 'message_sent':
          metrics.totalMessages++;
          break;
        case 'response_received':
          metrics.totalResponses++;
          if (event.event_data?.responseTime) {
            responseTimes.push(event.event_data.responseTime);
          }
          if (event.event_data?.category) {
            metrics.categoryBreakdown[event.event_data.category] = 
              (metrics.categoryBreakdown[event.event_data.category] || 0) + 1;
          }
          if (event.event_data?.confidence) {
            confidenceScores.push(event.event_data.confidence);
          }
          break;
        case 'error':
          metrics.totalErrors++;
          break;
      }
    });

    metrics.totalSessions = metrics.totalSessions.size;
    metrics.totalConversations = metrics.totalConversations.size;

    if (responseTimes.length > 0) {
      metrics.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    }

    if (confidenceScores.length > 0) {
      metrics.averageConfidence = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;
    }

    // Calculate engagement score
    const activeDays = Object.keys(dailyActivity).length;
    const messagesPerDay = metrics.totalMessages / Math.max(activeDays, 1);
    const errorRate = metrics.totalErrors / Math.max(metrics.totalMessages, 1);
    
    metrics.engagementScore = Math.min(100, 
      (messagesPerDay * 10) + 
      (metrics.averageConfidence * 50) - 
      (errorRate * 30)
    );

    metrics.activeDays = activeDays;
    metrics.dailyActivity = dailyActivity;

    return metrics;
  }

  processSystemMetrics(analytics) {
    const metrics = {
      totalUsers: new Set(),
      totalSessions: new Set(),
      totalConversations: new Set(),
      totalMessages: 0,
      totalResponses: 0,
      totalErrors: 0,
      averageResponseTime: 0,
      systemLoad: {},
      categoryDistribution: {},
      averageConfidence: 0,
      errorRate: 0,
      peakHours: {},
      userRetention: {}
    };

    let responseTimes = [];
    let confidenceScores = [];
    let hourlyLoad = {};
    let userActivity = {};

    analytics.forEach(event => {
      const eventDate = new Date(event.created_at);
      const hour = eventDate.getHours();
      const day = eventDate.toDateString();

      if (event.user_id) {
        metrics.totalUsers.add(event.user_id);
        if (!userActivity[event.user_id]) {
          userActivity[event.user_id] = new Set();
        }
        userActivity[event.user_id].add(day);
      }
      
      if (event.session_id) metrics.totalSessions.add(event.session_id);
      if (event.conversation_id) metrics.totalConversations.add(event.conversation_id);

      hourlyLoad[hour] = (hourlyLoad[hour] || 0) + 1;

      switch (event.event_type) {
        case 'message_sent':
          metrics.totalMessages++;
          break;
        case 'response_received':
          metrics.totalResponses++;
          if (event.event_data?.responseTime) {
            responseTimes.push(event.event_data.responseTime);
          }
          if (event.event_data?.category) {
            metrics.categoryDistribution[event.event_data.category] = 
              (metrics.categoryDistribution[event.event_data.category] || 0) + 1;
          }
          if (event.event_data?.confidence) {
            confidenceScores.push(event.event_data.confidence);
          }
          break;
        case 'error':
          metrics.totalErrors++;
          break;
      }
    });

    metrics.totalUsers = metrics.totalUsers.size;
    metrics.totalSessions = metrics.totalSessions.size;
    metrics.totalConversations = metrics.totalConversations.size;

    if (responseTimes.length > 0) {
      metrics.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    }

    if (confidenceScores.length > 0) {
      metrics.averageConfidence = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;
    }

    metrics.errorRate = metrics.totalErrors / Math.max(metrics.totalMessages, 1);
    metrics.peakHours = hourlyLoad;

    // Calculate user retention
    const totalDays = Object.keys(userActivity).length > 0 ? 
      Math.max(...Object.values(userActivity).map(days => days.size)) : 0;
    
    Object.entries(userActivity).forEach(([userId, activeDays]) => {
      const retentionRate = activeDays.size / Math.max(totalDays, 1);
      if (retentionRate >= 0.7) metrics.userRetention.high = (metrics.userRetention.high || 0) + 1;
      else if (retentionRate >= 0.3) metrics.userRetention.medium = (metrics.userRetention.medium || 0) + 1;
      else metrics.userRetention.low = (metrics.userRetention.low || 0) + 1;
    });

    return metrics;
  }

  getStartDate(timeframe) {
    const now = new Date();
    const days = parseInt(timeframe.replace('d', ''));
    return new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  }

  async generateInsights(supabase, userId = null, timeframe = '7d') {
    try {
      const metrics = userId ? 
        await this.getUserMetrics(supabase, userId, timeframe) :
        await this.getSystemMetrics(supabase, timeframe);

      if (!metrics) return null;

      const insights = {
        performance: this.generatePerformanceInsights(metrics),
        usage: this.generateUsageInsights(metrics),
        recommendations: this.generateRecommendations(metrics)
      };

      return insights;
    } catch (error) {
      console.error('Insights generation error:', error);
      return null;
    }
  }

  generatePerformanceInsights(metrics) {
    const insights = [];

    if (metrics.averageResponseTime > 5000) {
      insights.push({
        type: 'warning',
        message: 'Response times are higher than optimal (>5s)',
        value: metrics.averageResponseTime
      });
    }

    if (metrics.averageConfidence < 0.7) {
      insights.push({
        type: 'warning',
        message: 'AI confidence scores are below recommended threshold',
        value: metrics.averageConfidence
      });
    }

    if (metrics.errorRate > 0.05) {
      insights.push({
        type: 'error',
        message: 'Error rate is above acceptable threshold (>5%)',
        value: metrics.errorRate
      });
    }

    return insights;
  }

  generateUsageInsights(metrics) {
    const insights = [];

    if (metrics.categoryDistribution) {
      const topCategory = Object.entries(metrics.categoryDistribution)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (topCategory) {
        insights.push({
          type: 'info',
          message: `Most common query category: ${topCategory[0]}`,
          value: topCategory[1]
        });
      }
    }

    if (metrics.peakHours) {
      const peakHour = Object.entries(metrics.peakHours)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (peakHour) {
        insights.push({
          type: 'info',
          message: `Peak usage hour: ${peakHour[0]}:00`,
          value: peakHour[1]
        });
      }
    }

    return insights;
  }

  generateRecommendations(metrics) {
    const recommendations = [];

    if (metrics.averageResponseTime > 3000) {
      recommendations.push('Consider optimizing AI model or implementing response caching');
    }

    if (metrics.errorRate > 0.03) {
      recommendations.push('Review error logs and implement better error handling');
    }

    if (metrics.averageConfidence < 0.8) {
      recommendations.push('Consider fine-tuning the AI model or improving prompts');
    }

    if (metrics.engagementScore && metrics.engagementScore < 50) {
      recommendations.push('Focus on improving user engagement and response quality');
    }

    return recommendations;
  }
}

export const analyticsService = new AnalyticsService();
export default AnalyticsService;