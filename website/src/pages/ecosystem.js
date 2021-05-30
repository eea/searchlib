import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import Graph from 'react-graph-vis';

export default function Ecosystem(props) {
  const { siteConfig } = useDocusaurusContext();
  const graph = {
    nodes: [
      {
        id: 'airflowScheduler',
        label: 'airflow-scheduler',
        title: 'Airflow scheduler',
      },
      {
        id: 'airflowWorker',
        label: 'airflow-worker',
        title:
          'Airflow worker (Celery), the worker that executes the tasks given by the scheduler.',
      },
      {
        id: 'airflowWeb',
        label: 'airflow-web (GUI)',
        title: 'Airflow web service',
      },

      {
        id: 'flower',
        label: 'Flower (Celery GUI)',
        title: 'Flower, Celery monitor',
      },
      { id: 'postgres', label: 'Postgres', title: 'Postgres, the database' },
      {
        id: 'redis',
        label: 'Redis',
        title: 'Redis, broker that forwards messages from scheduler to worker.',
      },
      {
        id: 'rabbitmq',
        label: 'RabbitMQ',
        title: 'RabbitMQ, queue for logstash',
      },
      {
        id: 'logstash',
        label: 'Logstash',
        title: 'Logstash, stream processor',
      },
      {
        id: 'elastic',
        label: 'ElasticSearch',
        title: 'ElasticSearch',
      },
      {
        id: 'esproxy',
        label: 'es-proxy',
        title: 'ES Proxy',
      },
      {
        id: 'searchlib',
        label: 'searchlib',
        title: 'Searchlib (UI)',
      },
    ],
    edges: [
      { from: 'airflowScheduler', to: 'postgres' },
      { from: 'airflowWeb', to: 'postgres' },
      { from: 'airflowWorker', to: 'postgres' },
      { from: 'airflowWorker', to: 'rabbitmq' },
      { from: 'rabbitmq', to: 'logstash' },
      { from: 'airflowWorker', to: 'redis' },
      { from: 'flower', to: 'redis' },
      { from: 'logstash', to: 'elastic' },
      { from: 'elastic', to: 'esproxy' },
      { from: 'searchlib', to: 'esproxy' },
    ],
  };

  const options = {
    layout: {
      hierarchical: true,
    },
    edges: {
      color: '#000000',
    },
    height: '700px',
  };

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <h1>System architecture</h1>
      <main>
        <Graph graph={graph} options={options} />
      </main>
    </Layout>
  );
}
