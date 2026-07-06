import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { generateMetadata as genMetadata } from '@/lib/seo/metadata';
import { Card, CardContent } from '@/components/ui/card';
import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  BookOpen,
  Shield,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

export const metadata: Metadata = genMetadata({
  title: 'About Us',
  description:
    'Learn about MedUni — a medical education platform dedicated to advancing learning for medical students and healthcare professionals through expert-led webinars and comprehensive resources.',
  type: 'website',
  url: '/about',
});

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description:
      'We are committed to delivering the highest quality medical education content from industry-leading experts.',
  },
  {
    icon: Heart,
    title: 'Patient-Centered',
    description:
      'Our mission is to improve patient outcomes by empowering healthcare professionals with the latest knowledge.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'We foster a collaborative learning environment where medical professionals can connect and grow together.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description:
      'We leverage cutting-edge technology to make medical education accessible, engaging, and effective.',
  },
];

export default function AboutPage(): React.ReactElement {
  return (
    <div className="flex flex-col">
      <section className="relative py-24 bg-slate-900">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              About MedUni
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Empowering medical students and professionals with expert-led education,
              comprehensive learning resources, and a supportive community.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-teal-600/10">
                  <Target className="h-6 w-6 text-teal-600" />
                </div>
                <h2 className="font-serif text-3xl text-slate-900">Our Mission</h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                To provide accessible, high-quality medical education that empowers
                healthcare professionals to deliver exceptional patient care and
                advance their careers.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We believe that continuous learning is essential in the medical field,
                and we&apos;re committed to making world-class education available to
                medical professionals everywhere.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-teal-600/10">
                  <Eye className="h-6 w-6 text-teal-600" />
                </div>
                <h2 className="font-serif text-3xl text-slate-900">Our Vision</h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                To become a leading platform for medical education, recognized for
                excellence, innovation, and positive impact on healthcare outcomes.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We envision a future where every medical professional has access to
                the knowledge and skills they need to provide the best possible care.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24 bg-[#f8f6f1]">
        <Container>
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we serve our
              community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className={cn(
                    'border border-slate-200 hover:border-teal-500',
                    'transition-all duration-300 hover:shadow-lg',
                    'bg-white text-center'
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-teal-600/10 mb-4 mx-auto">
                      <Icon className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-4">
              Why Choose MedUni?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover what makes us the preferred choice for medical professionals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {[
              {
                icon: Award,
                title: 'Expert-Led Content',
                text: 'All our webinars are led by renowned medical professionals with years of experience in their respective fields.',
              },
              {
                icon: BookOpen,
                title: 'Comprehensive Resources',
                text: 'Access case studies, learning modules, quizzes, and materials that complement your webinar experience.',
              },
              {
                icon: Shield,
                title: 'Secure & Reliable',
                text: 'Your data and progress are protected. We maintain the highest standards of privacy and security.',
              },
              {
                icon: Zap,
                title: 'Flexible Learning',
                text: 'Learn at your own pace with replay access. Watch live or catch up later — the choice is yours.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-teal-600/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-teal-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-24 bg-gradient-to-br from-teal-600 to-teal-700">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Start your journey with MedUni today and take the next step in your
              medical career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link
                href="/webinars"
                className="inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-semibold text-teal-700 hover:bg-white/90 transition-all shadow-lg"
              >
                Explore Webinars
              </Link>
              <Link
                href="/webinars"
                className="inline-flex items-center rounded-full border-2 border-white/80 px-8 py-4 text-base font-semibold text-white bg-transparent hover:bg-white/10 transition-all"
              >
                Explore Webinars
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
