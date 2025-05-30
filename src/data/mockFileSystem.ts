export interface DirectoryNode {
  key: string;
  title: string;
  path: string;
  isLeaf?: boolean;
  children?: DirectoryNode[];
  iconType?: string;
  isProject?: boolean;
  projectType?: string;
  description?: string;
}

export const mockFileSystem: DirectoryNode[] = [
  {
    key: '/home',
    title: 'home',
    path: '/home',
    iconType: 'home',
    children: [
      {
        key: '/home/developer',
        title: 'developer',
        path: '/home/developer',
        iconType: 'folder',
        children: [
          {
            key: '/home/developer/projects',
            title: 'projects',
            path: '/home/developer/projects',
            iconType: 'folder',
            children: [
              {
                key: '/home/developer/projects/laravel-ecommerce',
                title: 'laravel-ecommerce',
                path: '/home/developer/projects/laravel-ecommerce',
                iconType: 'code',
                isProject: true,
                projectType: 'Laravel',
                description: 'Laravel 电商系统'
              },
              {
                key: '/home/developer/projects/wordpress-blog',
                title: 'wordpress-blog',
                path: '/home/developer/projects/wordpress-blog',
                iconType: 'code',
                isProject: true,
                projectType: 'WordPress',
                description: 'WordPress 博客系统'
              },
              {
                key: '/home/developer/projects/symfony-api',
                title: 'symfony-api',
                path: '/home/developer/projects/symfony-api',
                iconType: 'code',
                isProject: true,
                projectType: 'Symfony',
                description: 'Symfony REST API'
              },
              {
                key: '/home/developer/projects/pure-php-app',
                title: 'pure-php-app',
                path: '/home/developer/projects/pure-php-app',
                iconType: 'code',
                isProject: true,
                projectType: 'PHP',
                description: '纯 PHP 应用'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: '/var',
    title: 'var',
    path: '/var',
    iconType: 'folder',
    children: [
      {
        key: '/var/www',
        title: 'www',
        path: '/var/www',
        iconType: 'folder',
        children: [
          {
            key: '/var/www/html',
            title: 'html',
            path: '/var/www/html',
            iconType: 'code',
            isProject: true,
            projectType: 'PHP',
            description: '默认 Web 目录'
          }
        ]
      }
    ]
  }
];

export const getProjectTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    'Laravel': '#ff2d20',
    'Symfony': '#000000',
    'WordPress': '#21759b',
    'CodeIgniter': '#ee4323',
    'PHP': '#777bb4',
    'CakePHP': '#d33c43',
    'Zend': '#68b604',
    'Drupal': '#0678be'
  };
  return colors[type] || '#1890ff';
};
