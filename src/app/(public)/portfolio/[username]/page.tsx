import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserHeader } from "@/components/portfolio/user-header";
import { ProjectGallery } from "@/components/portfolio/project-gallery";
import { ContactForm } from "@/components/portfolio/contact-form";
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

  return {
    title: `${profile.display_name} - Portfolio | AiCensus`,
    description: profile.bio || `Check out ${profile.display_name}'s AI-built projects on AiCensus.`,
    openGraph: {
      title: `${profile.display_name} - Portfolio | AiCensus`,
      description: profile.bio || `Check out ${profile.display_name}'s AI-built projects on AiCensus.`,
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

        {/* About section */}
        {profile.about_md && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold">About</h2>
            <div className="prose prose-invert max-w-none prose-a:text-primary">
              <ReactMarkdown>{profile.about_md}</ReactMarkdown>
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
