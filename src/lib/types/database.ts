export type ToolStatus = "draft" | "published" | "archived";
export type SubmissionStatus = "pending" | "approved" | "rejected";
export type ProjectStatus = "draft" | "pending_review" | "published" | "rejected";
export type PricingModel =
  | "free"
  | "freemium"
  | "paid"
  | "open_source"
  | "enterprise"
  | "contact";
export type UserRole = "admin" | "editor" | "viewer";
export type FeaturedSubscriptionStatus =
  | "pending"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired";

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          display_order: number;
          parent_id: string | null;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
          parent_id?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
          parent_id?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tools: {
        Row: {
          id: string;
          name: string;
          slug: string;
          tagline: string;
          description: string;
          logo_url: string | null;
          screenshot_url: string | null;
          website_url: string;
          category_id: string | null;
          pricing_model: PricingModel;
          pricing_details: string | null;
          use_cases: string[];
          pros: string[];
          cons: string[];
          who_its_for: string[];
          key_features: string[];
          editor_rating: number | null;
          is_verified: boolean;
          is_featured: boolean;
          meta_title: string | null;
          meta_description: string | null;
          status: ToolStatus;
          affiliate_url: string | null;
          founded_year: number | null;
          company_name: string | null;
          headquarters: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          tagline: string;
          description: string;
          logo_url?: string | null;
          screenshot_url?: string | null;
          website_url: string;
          category_id?: string | null;
          pricing_model?: PricingModel;
          pricing_details?: string | null;
          use_cases?: string[];
          pros?: string[];
          cons?: string[];
          who_its_for?: string[];
          key_features?: string[];
          editor_rating?: number | null;
          is_verified?: boolean;
          is_featured?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          status?: ToolStatus;
          affiliate_url?: string | null;
          founded_year?: number | null;
          company_name?: string | null;
          headquarters?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          tagline?: string;
          description?: string;
          logo_url?: string | null;
          screenshot_url?: string | null;
          website_url?: string;
          category_id?: string | null;
          pricing_model?: PricingModel;
          pricing_details?: string | null;
          use_cases?: string[];
          pros?: string[];
          cons?: string[];
          who_its_for?: string[];
          key_features?: string[];
          editor_rating?: number | null;
          is_verified?: boolean;
          is_featured?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          status?: ToolStatus;
          affiliate_url?: string | null;
          founded_year?: number | null;
          company_name?: string | null;
          headquarters?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      tool_tags: {
        Row: {
          tool_id: string;
          tag_id: string;
        };
        Insert: {
          tool_id: string;
          tag_id: string;
        };
        Update: {
          tool_id?: string;
          tag_id?: string;
        };
      };
      tool_alternatives: {
        Row: {
          tool_id: string;
          alternative_id: string;
        };
        Insert: {
          tool_id: string;
          alternative_id: string;
        };
        Update: {
          tool_id?: string;
          alternative_id?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          submitter_name: string;
          submitter_email: string;
          tool_name: string;
          tool_website: string;
          tool_tagline: string | null;
          tool_description: string | null;
          tool_category_id: string | null;
          tool_pricing_model: PricingModel | null;
          status: SubmissionStatus;
          admin_notes: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          approved_tool_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          submitter_name: string;
          submitter_email: string;
          tool_name: string;
          tool_website: string;
          tool_tagline?: string | null;
          tool_description?: string | null;
          tool_category_id?: string | null;
          tool_pricing_model?: PricingModel | null;
          status?: SubmissionStatus;
          admin_notes?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          approved_tool_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          submitter_name?: string;
          submitter_email?: string;
          tool_name?: string;
          tool_website?: string;
          tool_tagline?: string | null;
          tool_description?: string | null;
          tool_category_id?: string | null;
          tool_pricing_model?: PricingModel | null;
          status?: SubmissionStatus;
          admin_notes?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          approved_tool_id?: string | null;
          created_at?: string;
        };
      };
      admin_profiles: {
        Row: {
          id: string;
          display_name: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          role?: UserRole;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          bio: string | null;
          about_md: string | null;
          avatar_url: string | null;
          header_image_url: string | null;
          github_url: string | null;
          twitter_url: string | null;
          linkedin_url: string | null;
          website_url: string | null;
          contact_email: string | null;
          featured_project_id: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          bio?: string | null;
          about_md?: string | null;
          avatar_url?: string | null;
          header_image_url?: string | null;
          github_url?: string | null;
          twitter_url?: string | null;
          linkedin_url?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          featured_project_id?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          bio?: string | null;
          about_md?: string | null;
          avatar_url?: string | null;
          header_image_url?: string | null;
          github_url?: string | null;
          twitter_url?: string | null;
          linkedin_url?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          featured_project_id?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolio_projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string;
          description: string;
          live_url: string;
          thumbnail_url: string | null;
          screenshots: string[];
          tech_stack: string[];
          ai_tools_used: string[];
          status: ProjectStatus;
          admin_notes: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          description: string;
          live_url: string;
          thumbnail_url?: string | null;
          screenshots?: string[];
          tech_stack?: string[];
          ai_tools_used?: string[];
          status?: ProjectStatus;
          admin_notes?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string;
          description?: string;
          live_url?: string;
          thumbnail_url?: string | null;
          screenshots?: string[];
          tech_stack?: string[];
          ai_tools_used?: string[];
          status?: ProjectStatus;
          admin_notes?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      project_messages: {
        Row: {
          id: string;
          recipient_user_id: string;
          project_id: string | null;
          sender_name: string;
          sender_email: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_user_id: string;
          project_id?: string | null;
          sender_name: string;
          sender_email: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_user_id?: string;
          project_id?: string | null;
          sender_name?: string;
          sender_email?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      featured_subscriptions: {
        Row: {
          id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          stripe_checkout_session_id: string | null;
          tool_id: string | null;
          tool_name: string;
          tool_website: string;
          tool_tagline: string | null;
          tool_description: string | null;
          tool_pricing_model: PricingModel | null;
          submitter_name: string;
          submitter_email: string;
          status: FeaturedSubscriptionStatus;
          current_period_start: string | null;
          current_period_end: string | null;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          stripe_checkout_session_id?: string | null;
          tool_id?: string | null;
          tool_name: string;
          tool_website: string;
          tool_tagline?: string | null;
          tool_description?: string | null;
          tool_pricing_model?: PricingModel | null;
          submitter_name: string;
          submitter_email: string;
          status?: FeaturedSubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string | null;
          stripe_checkout_session_id?: string | null;
          tool_id?: string | null;
          tool_name?: string;
          tool_website?: string;
          tool_tagline?: string | null;
          tool_description?: string | null;
          tool_pricing_model?: PricingModel | null;
          submitter_name?: string;
          submitter_email?: string;
          status?: FeaturedSubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      approve_submission: {
        Args: { p_submission_id: string; p_notes?: string | null };
        Returns: string;
      };
      reject_submission: {
        Args: { p_submission_id: string; p_notes?: string | null };
        Returns: undefined;
      };
      search_tools: {
        Args: { search_query: string };
        Returns: Database["public"]["Tables"]["tools"]["Row"][];
      };
      approve_project: {
        Args: { p_project_id: string; p_notes?: string | null };
        Returns: undefined;
      };
      reject_project: {
        Args: { p_project_id: string; p_notes?: string | null };
        Returns: undefined;
      };
    };
    Enums: {
      tool_status: ToolStatus;
      submission_status: SubmissionStatus;
      project_status: ProjectStatus;
      pricing_model: PricingModel;
      user_role: UserRole;
      featured_subscription_status: FeaturedSubscriptionStatus;
    };
  };
}

// Convenience types
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Tool = Database["public"]["Tables"]["tools"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Submission = Database["public"]["Tables"]["submissions"]["Row"];
export type AdminProfile = Database["public"]["Tables"]["admin_profiles"]["Row"];
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type PortfolioProject = Database["public"]["Tables"]["portfolio_projects"]["Row"];
export type ProjectMessage = Database["public"]["Tables"]["project_messages"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

export type ToolWithCategory = Tool & {
  categories: Category | null;
};

export type ProjectWithUser = PortfolioProject & {
  user_profiles: UserProfile;
};

export type FeaturedSubscription =
  Database["public"]["Tables"]["featured_subscriptions"]["Row"];
