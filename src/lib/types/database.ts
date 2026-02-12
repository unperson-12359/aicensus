export type ToolStatus = "draft" | "published" | "archived";
export type SubmissionStatus = "pending" | "approved" | "rejected";
export type PricingModel =
  | "free"
  | "freemium"
  | "paid"
  | "open_source"
  | "enterprise"
  | "contact";
export type UserRole = "admin" | "editor" | "viewer";

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
    };
    Views: Record<string, never>;
    Functions: {
      search_tools: {
        Args: { search_query: string };
        Returns: Database["public"]["Tables"]["tools"]["Row"][];
      };
    };
    Enums: {
      tool_status: ToolStatus;
      submission_status: SubmissionStatus;
      pricing_model: PricingModel;
      user_role: UserRole;
    };
  };
}

// Convenience types
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Tool = Database["public"]["Tables"]["tools"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Submission = Database["public"]["Tables"]["submissions"]["Row"];
export type AdminProfile = Database["public"]["Tables"]["admin_profiles"]["Row"];

export type ToolWithCategory = Tool & {
  categories: Category | null;
};
