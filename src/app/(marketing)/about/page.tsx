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
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const metadata: Metadata = genMetadata({
  title: 'About Us',
  description: 'Learn about MedUni - a professional medical education platform dedicated to advancing healthcare through expert-led webinars and comprehensive learning resources.',
  type: 'website',
  url: '/about',
});

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We are committed to delivering the highest quality medical education content from industry-leading experts.',
  },
  {
    icon: Heart,
    title: 'Patient-Centered',
    description: 'Our mission is to improve patient outcomes by empowering healthcare professionals with the latest knowledge.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We foster a collaborative learning environment where medical professionals can connect and grow together.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We leverage cutting-edge technology to make medical education accessible, engaging, and effective.',
  },
];

const stats = [
  {
    number: '10,000+',
    label: 'Medical Professionals',
  },
  {
    number: '500+',
    label: 'Expert Webinars',
  },
  {
    number: '50+',
    label: 'Medical Specialties',
  },
  {
    number: '98%',
    label: 'Satisfaction Rate',
  },
];

export default function AboutPage(): React.ReactElement {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 bg-gray-900">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              About MedUni
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Empowering medical professionals worldwide with expert-led education, 
              comprehensive learning resources, and a supportive community.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-green-600/10">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                To provide accessible, high-quality medical education that empowers healthcare 
                professionals to deliver exceptional patient care and advance their careers.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that continuous learning is essential in the medical field, and we&apos;re 
                committed to making world-class education available to medical professionals 
                everywhere, regardless of their location or schedule.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-green-600/10">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                To become the leading global platform for medical education, recognized for 
                excellence, innovation, and positive impact on healthcare outcomes worldwide.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We envision a future where every medical professional has access to the knowledge 
                and skills they need to provide the best possible care, contributing to a healthier 
                and more informed global community.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we serve our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className={cn(
                    'border border-gray-200 hover:border-green-600',
                    'transition-all duration-300 hover:shadow-lg',
                    'bg-white text-center'
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-green-600/10 mb-4 mx-auto">
                      <Icon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MedUni?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what makes us the preferred choice for medical professionals worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-green-600/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Expert-Led Content
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  All our webinars are led by renowned medical professionals with years of 
                  experience in their respective fields, ensuring you learn from the best.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-green-600/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Comprehensive Resources
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Access a vast library of case studies, research papers, articles, and learning 
                  materials that complement your webinar experience.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-green-600/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Secure & Reliable
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your data and progress are protected with enterprise-grade security. 
                  We&apos;re committed to maintaining the highest standards of privacy and security.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-green-600/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Flexible Learning
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn at your own pace with lifetime access to replays. Watch live sessions 
                  or catch up later - the choice is yours.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-green-600">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              MedUni by the Numbers
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Our impact speaks for itself. Join thousands of medical professionals 
              who trust MedUni for their continuing education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-white/90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Start your journey with MedUni today and take the next step in your medical career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button
                href="/sign-up"
                size="lg"
                className={cn(
                  'bg-green-600 hover:bg-green-700 text-white',
                  'px-8 py-6 text-base font-semibold',
                  'rounded-md shadow-lg transition-all',
                  'border-0'
                )}
              >
                Get Started Free
              </Button>
              <Button
                href="/webinars"
                variant="outline"
                size="lg"
                className={cn(
                  'border-2 border-white text-white',
                  'bg-transparent hover:bg-white/10',
                  'px-8 py-6 text-base font-semibold',
                  'rounded-md transition-all'
                )}
              >
                Explore Webinars
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

