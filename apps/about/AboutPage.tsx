// About page describing the platform's mission, features, and capabilities

import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, GraduationCap, Network, TrendingUp, User } from "lucide-react";

export function AboutPage() {
  return (
    <div className="space-y-8 pb-12">
      <Card className="shadow-md bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
        <CardContent className="p-8 md:p-12">
          <div className="text-center space-y-4">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
              Фонд Права — деловая сеть для юридического сообщества
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Социальная миссия платформы состоит в объединении юристов, повышении их профессиональной
              активности и эффективности
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-500" />
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            Участники
          </h2>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-6 space-y-4">
            <p className="leading-7">
              Фонд Права ориентирован на юристов, юридические фирмы, выпускников юридических факультетов, а
              также сообщества и объединения. Мы понимаем вызовы и потребности юридического сообщества.
            </p>
            <p className="leading-7">
              Также приглашаются специалисты смежных отраслей, эксперты, оценщики, медиаторы для создания
              обширного профессионального сообщества.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-blue-500" />
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            Что предлагает платформа
          </h2>
        </div>

        <div className="space-y-4">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">Доверие и узнаваемость</h3>
                  <p className="text-muted-foreground leading-7">
                    В юридической сфере репутация – главная валюта. Платформа способствует построению крепкой репутации.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-1">Персональный профиль</h4>
                      <p className="text-sm text-muted-foreground">
                        Цифровая визитная карточка в профессиональном сообществе.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-1">Лента публикаций</h4>
                      <p className="text-sm text-muted-foreground">
                        Демонстрация экспертизы, аналитические статьи, кейсы. Получить признание в своей нише.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-1">Верификация</h4>
                      <p className="text-sm text-muted-foreground">
                        Система подтверждения экспертности, навыков, кейсов.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">Кадровый центр</h3>
                  <p className="text-muted-foreground leading-7">
                    Готовая инфраструктура для проведения кадровых конкурсов и отборов.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Разработка заданий (шаблоны), тестирование участников, итоговая статистика, настройки доступа к результатам (проверяющие,
                    работодатели и др.).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Network className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">Нетворк нового уровня</h3>
                  <p className="text-muted-foreground leading-7">
                    Не просто список контактов, а динамичная сеть возможностей.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-1">Карта связей</h4>
                      <p className="text-sm text-muted-foreground">
                        Визуализация подписок и профессиональных связей, оценка
                        точек пересечения и новых возможностей для
                        сотрудничества. Приватная сеть.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-1">Клубы</h4>
                      <p className="text-sm text-muted-foreground">
                        Присоединяйтесь к экспертным группам. Обменивайтесь
                        опытом, обсуждайте сложные кейсы и находите партнеров
                        для совместных проектов.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">Развитие бизнеса</h3>
                  <p className="text-muted-foreground leading-7">
                    Инструменты для проактивного развития юридической фирмы и управления клиентскими потоками.
                  </p>
                  <div className="space-y-3 mt-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-1">Трекинг</h4>
                      <div className="grid md:grid-cols-2 gap-3 mt-2">
                        <div className="text-sm">
                          <strong className="text-foreground">PR (Public Relations)</strong>
                          <p className="text-muted-foreground">Цифровые ресурсы, участие в мероприятиях, демонстрация экспертизы</p>
                        </div>
                        <div className="text-sm">
                          <strong className="text-foreground">MR (Marketing Research)</strong>
                          <p className="text-muted-foreground">Позиционирование, ценообразование, каналы привлечения клиентов</p>
                        </div>
                        <div className="text-sm">
                          <strong className="text-foreground">GR (Government Relations)</strong>
                          <p className="text-muted-foreground">Вхождение в составы профессиональных сообществ, общественных
                          советов и экспертных групп</p>
                        </div>
                        <div className="text-sm">
                          <strong className="text-foreground">HR (Human Resources)</strong>
                          <p className="text-muted-foreground">Формирование команды и привлечение новых кадров</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
