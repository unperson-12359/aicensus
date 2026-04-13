import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserHeader } from "@/components/portfolio/user-header";
import { ProjectGallery } from "@/components/portfolio/project-gallery";
import { ContactForm } from "@/components/portfolio/contact-form";
import { ShareButton } from "@/components/portfolio/share-button";
import {
  getUserProfileByUsername,
  getPublishedProjects,
} from "@/lib/queries/portfolios";
import ReactMarkdown from "react-markdown";

export const revalidate = 1800;

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getUserProfileByUsername(username);

  if (!profile) return { title: "Not Found - AiCensus" };

  const description = profile.bio || `Check out ${profile.display_name}'s AI-built projects on AiCensus.`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";
  const profileUrl = `${siteUrl}/portfolio/${username}`;

  // Extract Twitter handle from URL if available
  const twitterHandle = profile.twitter_url
    ? profile.twitter_url.replace(/.*twitter\.com\/|.*x\.com\//, "").replace(/\/.*/, "")
    : undefined;

  return {
    title: `${profile.display_name} - Portfolio | AiCensus`,
    description,
    openGraph: {
      title: `${profile.display_name} - Portfolio | AiCensus`,
      description,
      url: profileUrl,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.display_name} - Portfolio | AiCensus`,
      description,
      ...(twitterHandle ? { creator: `@${twitterHandle}` } : {}),
    },
  };
}

export default async function UserPortfolioPage({ params }: Props) {
  const { username } = await params;
  const profile = await getUserProfileByUsername(username);

  if (!profile) notFound();

  const projects = await getPublishedProjects(profile.id);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <UserHeader profile={profile} projectCount={projects.length} />
        <div className="mt-4">
          <ShareButton
            type="profile"
            profile={profile}
            projects={projects}
            username={username}
          />
        </div>

        {/* About section */}
        {profile.about_md && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold">About</h2>
            <div className="prose prose-invert max-w-none prose-a:text-primary">
              <ReactMarkdown skipHtml>{profile.about_md}</ReactMarkdown>
            </div>
          </section>
        )}

        {/* Projects */}
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-semibold">Projects</h2>
          <ProjectGallery projects={projects} username={username} />
        </section>

        {/* Contact Form */}
        <section className="mt-12">
          <ContactForm
            recipientUserId={profile.id}
            recipientName={profile.display_name}
          />
        </section>
      </div>
    </div>
  );
}
